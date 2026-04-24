import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await pool.query(sql);
  console.log("✅ Migration successful!");
} catch (err) {
  console.error("❌ Migration failed:", err.message);
} finally {
  await pool.end();
}