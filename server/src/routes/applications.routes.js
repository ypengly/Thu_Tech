// server/src/routes/applications.routes.js
const express = require("express");
const path = require("path");
const { query } = require("../config/db");
const { requireAuth, requireResource } = require("../middleware/auth");
const { UPLOAD_DIR } = require("../middleware/upload");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();
const guard = requireResource("applications");
const STATUSES = ["new", "reviewing", "shortlisted", "interview", "rejected", "hired"];

router.get("/", requireAuth, guard, asyncHandler(async (req, res) => {
  const { status, career_id, page = 1, pageSize = 25 } = req.query;
  const clauses = [];
  const params = [];
  if (status) { params.push(status); clauses.push(`status = $${params.length}`); }
  if (career_id) { params.push(career_id); clauses.push(`career_id = $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.min(Number(pageSize) || 25, 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const countRes = await query(`SELECT COUNT(*)::int AS count FROM job_applications ${where}`, params);
  const dataRes = await query(
    `SELECT id, career_id, position_title, applicant_name, email, phone, status, created_at
     FROM job_applications ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params
  );
  res.json({ data: dataRes.rows, pagination: { page: Number(page), pageSize: limit, total: countRes.rows[0].count } });
}));

router.get("/:id", requireAuth, guard, asyncHandler(async (req, res) => {
  const result = await query("SELECT * FROM job_applications WHERE id = $1", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  res.json({ data: result.rows[0] });
}));

// Resumes are never public — only an authenticated admin with the "applications"
// permission can download one, streamed from disk (not a public /uploads URL).
router.get("/:id/resume", requireAuth, guard, asyncHandler(async (req, res) => {
  const result = await query("SELECT resume_url FROM job_applications WHERE id = $1", [req.params.id]);
  if (!result.rows.length || !result.rows[0].resume_url) {
    return res.status(404).json({ error: "No resume on file for this application." });
  }
  const filePath = path.join(UPLOAD_DIR, path.basename(result.rows[0].resume_url));
  res.download(filePath);
}));

router.patch("/:id/status", requireAuth, guard, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status." });
  const result = await query(
    "UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  res.json({ data: result.rows[0], message: "Status updated." });
}));

router.delete("/:id", requireAuth, guard, asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM job_applications WHERE id = $1 RETURNING id", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  res.json({ message: "Deleted successfully." });
}));

module.exports = router;
