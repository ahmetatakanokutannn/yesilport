import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { body, validationResult } from "express-validator";
import PDFDocument from "pdfkit";
import { randomUUID } from "node:crypto";
import { migrate, pool } from "./db";

dotenv.config();

type Role = "ROLE_USER" | "ROLE_PREMIUM" | "ROLE_ADMIN";
type JwtUser = { id: number; role: Role; email: string };

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

const app = express();
const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const emissionFactors: Record<string, number> = {
  ROAD_DIESEL: 0.089,
  ROAD_HVO: 0.012,
  SEA_DIESEL: 0.016,
  SEA_LNG: 0.014,
  AIR_DIESEL: 0.602,
  RAIL_ELECTRIC: 0.028,
  RAIL_DIESEL: 0.041
};

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

function validate(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Form alanlarını kontrol edin.", errors: errors.array() });
    return false;
  }
  return true;
}

function sign(user: JwtUser): string {
  const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"] };
  return jwt.sign(user, jwtSecret, options);
}

function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies.token ?? req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Oturum gerekli." });
    return;
  }
  try {
    req.user = jwt.verify(token, jwtSecret) as JwtUser;
    next();
  } catch {
    res.status(401).json({ message: "Oturum süresi doldu." });
  }
}

function admin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== "ROLE_ADMIN") {
    res.status(403).json({ message: "Admin yetkisi gerekli." });
    return;
  }
  next();
}

function calculateLeg(leg: { transportType: string; fuelType: string; distanceKm: number; weightTon: number; fillRate: number; frequency: number }) {
  const key = `${leg.transportType}_${leg.fuelType}`;
  const fallback = leg.transportType === "SEA" ? 0.016 : leg.transportType === "AIR" ? 0.602 : leg.transportType === "RAIL" ? 0.028 : 0.089;
  const factor = emissionFactors[key] ?? fallback;
  const co2eKg = leg.distanceKm * leg.weightTon * (leg.fillRate / 100) * factor * leg.frequency;
  return { ...leg, factor, co2eKg };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "yesilport-api" }));

app.post("/api/auth/register", [
  body("firstName").trim().isLength({ min: 2 }),
  body("lastName").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("kvkk").equals("true")
], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const hash = await bcrypt.hash(req.body.password, 12);
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const result = await pool.query(
    `INSERT INTO users (first_name,last_name,email,password_hash,phone,company_name,company_type,transport_types,verification_token,qa_credits)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,3)
     RETURNING id,email,role,first_name,last_name,company_name,subscription_status,qa_credits`,
    [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.phone, req.body.companyName, req.body.companyType, req.body.transportTypes ?? [], otp]
  );
  res.status(201).json({ user: result.rows[0], verificationCode: otp, message: "Kayıt oluşturuldu. Demo ortamında OTP yanıt içinde döner." });
}));

app.post("/api/auth/verify-email", [body("email").isEmail(), body("code").isLength({ min: 6, max: 6 })], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const result = await pool.query("UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE email = $1 AND verification_token = $2 RETURNING id,email,role", [req.body.email, req.body.code]);
  if (!result.rowCount) res.status(400).json({ message: "Doğrulama kodu geçersiz." });
  else res.json({ message: "E-posta doğrulandı.", user: result.rows[0] });
}));

app.post("/api/auth/login", [body("email").isEmail().normalizeEmail(), body("password").notEmpty()], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
    res.status(401).json({ message: "E-posta veya şifre hatalı." });
    return;
  }
  const token = sign({ id: user.id, role: user.role, email: user.email });
  res.cookie("token", token, cookieOptions).json({ user: publicUser(user) });
}));

app.post("/api/auth/forgot-password", [body("email").isEmail().normalizeEmail()], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const token = randomUUID();
  await pool.query("UPDATE users SET reset_token=$1, reset_token_expires=NOW() + interval '1 hour' WHERE email=$2", [token, req.body.email]);
  res.json({ message: "Şifre sıfırlama bağlantısı gönderildi.", resetToken: token });
}));

app.post("/api/auth/reset-password", [body("token").notEmpty(), body("password").isLength({ min: 8 })], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const hash = await bcrypt.hash(req.body.password, 12);
  const result = await pool.query("UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL WHERE reset_token=$2 AND reset_token_expires > NOW()", [hash, req.body.token]);
  res.status(result.rowCount ? 200 : 400).json({ message: result.rowCount ? "Şifre güncellendi." : "Bağlantı geçersiz veya süresi dolmuş." });
}));

app.post("/api/auth/refresh-token", auth, (req, res) => {
  const token = sign(req.user as JwtUser);
  res.cookie("token", token, cookieOptions).json({ ok: true });
});

app.post("/api/auth/logout", (_req, res) => res.clearCookie("token").json({ ok: true }));

app.get("/api/users/me", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [req.user?.id]);
  res.json({ user: publicUser(result.rows[0]) });
}));

app.put("/api/users/me", auth, asyncHandler(async (req, res) => {
  const result = await pool.query(
    "UPDATE users SET first_name=COALESCE($1,first_name), last_name=COALESCE($2,last_name), phone=$3, company_name=$4, updated_at=NOW() WHERE id=$5 RETURNING *",
    [req.body.firstName, req.body.lastName, req.body.phone, req.body.companyName, req.user?.id]
  );
  res.json({ user: publicUser(result.rows[0]) });
}));

app.delete("/api/users/me", auth, asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.user?.id]);
  res.clearCookie("token").json({ ok: true });
}));

app.post("/api/calculations/demo", (req, res) => {
  const legs = (req.body.legs ?? [req.body]).map(calculateLeg);
  const total = legs.reduce((sum: number, leg: { co2eKg: number }) => sum + leg.co2eKg, 0);
  res.json({ legs, totalCo2eKg: total, cbamCostEur: (total / 1000) * 50, industryBenchmark: total * 1.12 });
});

app.post("/api/calculations", auth, asyncHandler(async (req, res) => {
  const legs = (req.body.legs ?? []).map(calculateLeg);
  const total = legs.reduce((sum: number, leg: { co2eKg: number }) => sum + leg.co2eKg, 0);
  const cbam = (total / 1000) * 50;
  const result = await pool.query(
    "INSERT INTO calculations (user_id,title,legs,total_co2e_monthly,cbam_cost_eur,industry_benchmark) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [req.user?.id, req.body.title ?? "Yeni hesaplama", JSON.stringify(legs), total, cbam, total * 1.12]
  );
  res.status(201).json({ calculation: result.rows[0] });
}));

app.get("/api/calculations", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM calculations WHERE user_id=$1 ORDER BY created_at DESC", [req.user?.id]);
  res.json({ calculations: result.rows });
}));

app.get("/api/calculations/:id", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM calculations WHERE id=$1 AND user_id=$2", [req.params.id, req.user?.id]);
  res.status(result.rowCount ? 200 : 404).json(result.rowCount ? { calculation: result.rows[0] } : { message: "Bulunamadı." });
}));

app.delete("/api/calculations/:id", auth, asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM calculations WHERE id=$1 AND user_id=$2", [req.params.id, req.user?.id]);
  res.json({ ok: true });
}));

app.post("/api/scenarios", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("INSERT INTO scenarios (user_id,calculation_id,name,scenarios_data,comparison_result) VALUES ($1,$2,$3,$4,$5) RETURNING *", [req.user?.id, req.body.calculationId, req.body.name, req.body.scenarios, req.body.result]);
  res.status(201).json({ scenario: result.rows[0] });
}));
app.get("/api/scenarios", auth, listMine("scenarios"));
app.get("/api/scenarios/:id", auth, getMine("scenarios"));

app.get("/api/compliance/score", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM compliance_scores WHERE user_id=$1 ORDER BY recorded_at DESC LIMIT 1", [req.user?.id]);
  res.json({ score: result.rows[0] ?? { cbam_score: 72, csrd_score: 61, ylb_score: 68, total_score: 67 } });
}));
app.post("/api/compliance/checklist", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("INSERT INTO compliance_scores (user_id,cbam_score,csrd_score,ylb_score,total_score,checklist_data) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [req.user?.id, 72, 61, 68, 67, req.body]);
  res.status(201).json({ score: result.rows[0] });
}));
app.get("/api/compliance/history", auth, (_req, res) => res.json({ history: [54, 58, 61, 63, 65, 67] }));

app.get("/api/questions", auth, listMine("questions"));
app.post("/api/questions", auth, [body("questionText").isLength({ min: 50 })], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  await pool.query("UPDATE users SET qa_credits = GREATEST(qa_credits - 1, 0) WHERE id=$1", [req.user?.id]);
  const result = await pool.query("INSERT INTO questions (user_id,category,question_text,attachment_url) VALUES ($1,$2,$3,$4) RETURNING *", [req.user?.id, req.body.category, req.body.questionText, req.body.attachmentUrl]);
  res.status(201).json({ question: result.rows[0] });
}));
app.put("/api/questions/:id/rate", auth, asyncHandler(async (req, res) => {
  await pool.query("UPDATE questions SET rating=$1 WHERE id=$2 AND user_id=$3", [req.body.rating, req.params.id, req.user?.id]);
  res.json({ ok: true });
}));

app.get("/api/admin/questions", auth, admin, asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT q.*, u.email FROM questions q JOIN users u ON u.id=q.user_id ORDER BY q.created_at DESC");
  res.json({ questions: result.rows });
}));
app.put("/api/admin/questions/:id/answer", auth, admin, asyncHandler(async (req, res) => {
  const result = await pool.query("UPDATE questions SET status='ANSWERED', answer_text=$1, answered_by=$2, answered_at=NOW() WHERE id=$3 RETURNING *", [req.body.answerText, req.user?.id, req.params.id]);
  res.json({ question: result.rows[0] });
}));

app.get("/api/mentors", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT id, first_name, last_name, email, company_name FROM users WHERE role IN ('ROLE_ADMIN','ROLE_PREMIUM') ORDER BY id LIMIT 10");
  res.json({ mentors: result.rows });
}));
app.get("/api/mentors/:id/availability", (_req, res) => res.json({ slots: ["2026-06-03T10:00:00", "2026-06-04T14:00:00", "2026-06-05T11:00:00"] }));
app.post("/api/appointments", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("INSERT INTO appointments (user_id,mentor_id,scheduled_at,meeting_url,notes) VALUES ($1,$2,$3,$4,$5) RETURNING *", [req.user?.id, req.body.mentorId, req.body.scheduledAt, "https://teams.microsoft.com/l/meetup-join/yesilport-demo", req.body.notes]);
  res.status(201).json({ appointment: result.rows[0] });
}));
app.get("/api/appointments", auth, listMine("appointments"));

app.get("/api/courses", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT * FROM courses WHERE is_active=TRUE ORDER BY id");
  res.json({ courses: result.rows });
}));
app.get("/api/courses/:id", asyncHandler(async (req, res) => {
  const course = await pool.query("SELECT * FROM courses WHERE id=$1", [req.params.id]);
  const modules = await pool.query("SELECT * FROM course_modules WHERE course_id=$1 ORDER BY order_index", [req.params.id]);
  res.json({ course: course.rows[0], modules: modules.rows });
}));
app.post("/api/enrollments/:courseId", auth, asyncHandler(async (req, res) => {
  const result = await pool.query("INSERT INTO enrollments (user_id,course_id) VALUES ($1,$2) ON CONFLICT (user_id,course_id) DO UPDATE SET enrolled_at=enrollments.enrolled_at RETURNING *", [req.user?.id, req.params.courseId]);
  res.status(201).json({ enrollment: result.rows[0] });
}));
app.get("/api/enrollments/me", auth, listMine("enrollments"));
app.put("/api/enrollments/:courseId/progress", auth, asyncHandler(async (req, res) => {
  await pool.query("UPDATE enrollments SET progress_percent=$1, completed_at=CASE WHEN $1 >= 100 THEN NOW() ELSE completed_at END WHERE user_id=$2 AND course_id=$3", [req.body.progress, req.user?.id, req.params.courseId]);
  res.json({ ok: true });
}));

app.get("/api/blog", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT * FROM blog_posts WHERE published=TRUE ORDER BY published_at DESC, created_at DESC");
  res.json({ posts: result.rows });
}));
app.get("/api/blog/:slug", asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM blog_posts WHERE slug=$1 AND published=TRUE", [req.params.slug]);
  res.status(result.rowCount ? 200 : 404).json(result.rowCount ? { post: result.rows[0] } : { message: "Bulunamadı." });
}));
app.post("/api/admin/blog", auth, admin, asyncHandler(async (req, res) => {
  const result = await pool.query("INSERT INTO blog_posts (title,slug,excerpt,content,category,tags,thumbnail_url,author_id,published,published_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW()) RETURNING *", [req.body.title, req.body.slug, req.body.excerpt, req.body.content, req.body.category, req.body.tags ?? [], req.body.thumbnailUrl, req.user?.id, req.body.published ?? true]);
  res.status(201).json({ post: result.rows[0] });
}));
app.put("/api/admin/blog/:id", auth, admin, asyncHandler(async (req, res) => {
  const result = await pool.query("UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, category=$4, published=$5 WHERE id=$6 RETURNING *", [req.body.title, req.body.excerpt, req.body.content, req.body.category, req.body.published, req.params.id]);
  res.json({ post: result.rows[0] });
}));
app.delete("/api/admin/blog/:id", auth, admin, asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM blog_posts WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
}));

app.get("/api/regulations/alerts", asyncHandler(async (_req, res) => {
  const result = await pool.query("SELECT * FROM regulation_alerts ORDER BY published_at DESC LIMIT 10");
  res.json({ alerts: result.rows });
}));

app.post("/api/demo-requests", [
  body("fullName").trim().isLength({ min: 3 }),
  body("companyName").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail()
], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  const result = await pool.query("INSERT INTO demo_requests (full_name,company_name,email,phone,transport_type,description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [req.body.fullName, req.body.companyName, req.body.email, req.body.phone, req.body.transportType, req.body.description]);
  res.status(201).json({ request: result.rows[0], message: "Demo talebiniz alındı." });
}));
app.post("/api/newsletter/subscribe", [body("email").isEmail().normalizeEmail()], asyncHandler(async (req, res) => {
  if (!validate(req, res)) return;
  await pool.query("INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING", [req.body.email]);
  res.status(201).json({ message: "Bültene kaydoldunuz." });
}));
app.get("/api/stats", (_req, res) => res.json({ companies: 500, calculations: 10000, regulations: 3, months: 36 }));

app.post("/api/reports/generate", auth, (req, res) => {
  const doc = new PDFDocument({ margin: 48 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=yesilport-rapor.pdf");
  doc.pipe(res);
  doc.fontSize(22).fillColor("#16a34a").text("YesilPORT Karbon Raporu");
  doc.moveDown().fontSize(12).fillColor("#111827").text(`Firma: ${req.body.companyName ?? "Demo Lojistik A.S."}`);
  doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`);
  doc.text(`CO2e Ozeti: ${req.body.totalCo2e ?? "12.4 ton/yil"}`);
  doc.text(`CBAM Tahmini: ${req.body.cbamCost ?? "620 EUR/yil"}`);
  doc.moveDown().text("Oneriler: Euro 6 filo gecisi, rota optimizasyonu, HVO yakit pilotu ve demiryolu entegrasyonu.");
  doc.end();
});
app.get("/api/reports", auth, listMine("reports"));
app.get("/api/reports/:id/download", auth, (_req, res) => res.redirect(307, "/api/reports/generate"));

["users", "appointments", "courses", "reports"].forEach((resource) => {
  app.get(`/api/admin/${resource}`, auth, admin, asyncHandler(async (_req, res) => {
    const result = await pool.query(`SELECT * FROM ${resource} ORDER BY id DESC LIMIT 200`);
    res.json({ [resource]: result.rows });
  }));
});
app.get("/api/admin/stats", auth, admin, (_req, res) => res.json({ users: 128, subscriptions: 34, calculationsToday: 86, openQuestions: 12, revenueTry: 182400 }));
app.post("/api/admin/announcements", auth, admin, (_req, res) => res.status(202).json({ message: "Duyuru gönderim kuyruğuna alındı." }));

function listMine(table: string) {
  return asyncHandler(async (req, res) => {
    const result = await pool.query(`SELECT * FROM ${table} WHERE user_id=$1 ORDER BY created_at DESC`, [req.user?.id]);
    res.json({ [table]: result.rows });
  });
}

function getMine(table: string) {
  return asyncHandler(async (req, res) => {
    const result = await pool.query(`SELECT * FROM ${table} WHERE id=$1 AND user_id=$2`, [req.params.id, req.user?.id]);
    res.status(result.rowCount ? 200 : 404).json(result.rowCount ? { [table.slice(0, -1)]: result.rows[0] } : { message: "Bulunamadı." });
  });
}

function publicUser(user: Record<string, unknown>) {
  const { password_hash: _passwordHash, reset_token: _resetToken, verification_token: _verificationToken, ...safe } = user;
  return safe;
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Sunucu hatası.", detail: process.env.NODE_ENV === "development" ? err.message : undefined });
});

migrate()
  .then(() => app.listen(port, () => console.log(`YeşilPORT API http://localhost:${port}`)))
  .catch((err: unknown) => {
    console.error("Database migration failed", err);
    process.exit(1);
  });
