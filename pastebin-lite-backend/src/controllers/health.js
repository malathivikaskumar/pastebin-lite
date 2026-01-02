import { pool } from "../db/db.js";

export async function healthCheck(req, res) {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}
