import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://yesilport:password@localhost:5432/yesilport"
});

export async function migrate(): Promise<void> {
  const compiledPath = path.join(__dirname, "schema.sql");
  const sourcePath = path.join(process.cwd(), "src", "db", "schema.sql");
  const schema = fs.readFileSync(fs.existsSync(compiledPath) ? compiledPath : sourcePath, "utf8");
  await pool.query(schema);
}
