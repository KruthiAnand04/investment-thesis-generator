import express from "express";
import pool from "../db/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { startup_name, overall_score, recommendation, confidence, result_json } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO analyses (user_id, startup_name, overall_score, recommendation, confidence, result_json)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, startup_name, overall_score, recommendation, confidence, JSON.stringify(result_json)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM analyses WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;