import bcrypt from "bcryptjs";
import { migrate, pool } from "./db";

async function seed(): Promise<void> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const demoEmail = process.env.SEED_DEMO_EMAIL;
  const seedPassword = process.env.SEED_DEMO_PASSWORD;

  if (!adminEmail || !demoEmail || !seedPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL, SEED_DEMO_EMAIL and SEED_DEMO_PASSWORD must be set before seeding."
    );
  }

  await migrate();
  const password = await bcrypt.hash(seedPassword, 12);
  const admin = await pool.query(
    `INSERT INTO users (first_name,last_name,email,password_hash,phone,company_name,company_type,transport_types,role,email_verified,subscription_status,qa_credits)
     VALUES ('Ozan','Evren',$1,$2,'0216 578 38 34','Yeditepe TTO A.S.','CONSULTING',ARRAY['ROAD','SEA'],'ROLE_ADMIN',TRUE,'CORPORATE',99)
     ON CONFLICT (email) DO UPDATE SET role='ROLE_ADMIN'
     RETURNING id`,
    [adminEmail, password]
  );
  await pool.query(
    `INSERT INTO users (first_name,last_name,email,password_hash,company_name,company_type,transport_types,role,email_verified,subscription_status,qa_credits)
     VALUES ('Demo','Kullanici',$1,$2,'Pilot Firma A','LOGISTICS',ARRAY['ROAD','RAIL'],'ROLE_PREMIUM',TRUE,'PROFESSIONAL',8)
     ON CONFLICT (email) DO NOTHING`,
    [demoEmail, password]
  );

  const courses = [
    ["CBAM'i Anlamak", "CBAM, SKDM ve AB ihracat risklerini pratik örneklerle öğrenin.", "Mevzuat", 4, 2.5, "FREE"],
    ["Karbon Ayak İzi Hesaplama Temelleri", "GLEC temelli lojistik emisyon hesaplama eğitimi.", "Hesaplama", 6, 3, "FREE"],
    ["CSRD Raporlama Rehberi", "ESRS veri setleri, KPI takibi ve raporlama hazırlığı.", "Raporlama", 8, 5, "PREMIUM"],
    ["Yeşil Lojistik Belgesi Başvuru Süreci", "Ocak başvuru penceresi, KEP ve e-imza adımları.", "YLB", 3, 1.5, "FREE"],
    ["Senaryo Analizi ve Karar Verme", "Azaltım senaryolarını finansal etkiyle kıyaslayın.", "Analiz", 5, 3, "PREMIUM"]
  ];
  for (const c of courses) {
    const result = await pool.query(
      "INSERT INTO courses (title,description,category,total_modules,duration_hours,access_level,thumbnail_url) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING RETURNING id",
      [...c, "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=900&q=80"]
    );
    const courseId = result.rows[0]?.id;
    if (courseId) {
      await pool.query("INSERT INTO course_modules (course_id,title,video_url,transcript,order_index,duration_minutes) VALUES ($1,$2,$3,$4,1,35)", [
        courseId,
        "Giriş ve kavramlar",
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "Bu modül YeşilPORT demo eğitim transkriptidir."
      ]);
    }
  }

  const posts = [
    ["CBAM 2026 Tam Uygulamaya Geçiyor: Lojistik Firmaları Ne Yapmalı?", "cbam-2026-lojistik-firmalari", "Mevzuat", "2026-01-15"],
    ["Yeşil Lojistik Belgesi Başvurusu: Adım Adım Kılavuz", "yesil-lojistik-belgesi-basvurusu", "Kılavuz", "2026-02-01"],
    ["Pilot Firma Deneyimi: 3 Ayda CBAM Uyumu", "pilot-firma-3-ayda-cbam-uyumu", "Başarı Hikayesi", "2026-02-20"],
    ["CSRD vs CBAM: Türk İhracatçısının Bilmesi Gerekenler", "csrd-vs-cbam", "Analiz", "2026-03-05"],
    ["Alman Tedarik Zinciri Yasası ve Türk Lojistik Şirketlerine Etkisi", "alman-tedarik-zinciri-yasasi", "Mevzuat", "2026-03-15"],
    ["YeşilPORT Webinar: Karbon Hesaplama Temelleri - Kayıt Özeti", "yesilport-webinar-karbon-hesaplama", "Webinar", "2026-04-10"]
  ];
  for (const [title, slug, category, date] of posts) {
    await pool.query(
      `INSERT INTO blog_posts (title,slug,excerpt,content,category,tags,thumbnail_url,author_id,published,published_at)
       VALUES ($1,$2,$3,$4,$5,ARRAY['CBAM','CSRD','Karbon Ayak İzi','Yeşil Lojistik'],$6,$7,TRUE,$8)
       ON CONFLICT (slug) DO NOTHING`,
      [
        title,
        slug,
        `${title} başlıklı YeşilPORT analizinden öne çıkan düzenleme ve aksiyon notları.`,
        "YeşilPORT uzman ekibi bu yazıda lojistik firmalarının AB düzenlemelerine hazırlanırken izlemesi gereken veri, süreç ve raporlama adımlarını özetler.",
        category,
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
        admin.rows[0].id,
        date
      ]
    );
  }

  const alerts = [
    ["CBAM geçiş dönemi raporlama kontrol listesi güncellendi", "CBAM", "WARNING"],
    ["Yeşil Lojistik Belgesi Ocak başvuru takvimi için hazırlık başladı", "YLB", "INFO"],
    ["CSRD kapsamındaki tedarikçi veri talepleri artıyor", "CSRD", "URGENT"]
  ];
  for (const [title, category, severity] of alerts) {
    await pool.query("INSERT INTO regulation_alerts (title,content,category,severity) VALUES ($1,$2,$3,$4)", [title, "YeşilPORT mevzuat merkezi bu değişiklik için aksiyon planı önerir.", category, severity]);
  }
}

seed()
  .then(() => console.log("Seed tamamlandı."))
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
