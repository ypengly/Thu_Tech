// server/src/routes/media.routes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { query } = require("../config/db");
const { requireAuth, requireResource } = require("../middleware/auth");
const { uploadImage, fileUrl, UPLOAD_DIR } = require("../middleware/upload");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.get("/", requireAuth, requireResource("media"), asyncHandler(async (req, res) => {
  const { search, page = 1, pageSize = 40 } = req.query;
  const clauses = [];
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    clauses.push(`filename ILIKE $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.min(Number(pageSize) || 40, 200);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const countRes = await query(`SELECT COUNT(*)::int AS count FROM media ${where}`, params);
  const dataRes = await query(
    `SELECT * FROM media ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  res.json({ data: dataRes.rows, pagination: { page: Number(page), pageSize: limit, total: countRes.rows[0].count } });
}));

router.post(
  "/upload",
  requireAuth,
  requireResource("media"),
  uploadImage.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file was uploaded." });
    const url = fileUrl(req.file.filename);
    const result = await query(
      `INSERT INTO media (filename, url, mime_type, size_bytes, alt_text, uploaded_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.file.originalname, url, req.file.mimetype, req.file.size, req.body.alt_text || null, req.user.sub]
    );
    res.status(201).json({ data: result.rows[0], message: "Uploaded successfully." });
  })
);

router.delete("/:id", requireAuth, requireResource("media"), asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM media WHERE id = $1 RETURNING *", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });

  const filePath = path.join(UPLOAD_DIR, path.basename(result.rows[0].url));
  fs.unlink(filePath, () => {}); // best-effort; DB row is already the source of truth

  res.json({ message: "Deleted successfully." });
}));

module.exports = router;
