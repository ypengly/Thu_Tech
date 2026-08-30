// server/src/routes/settings.routes.js
const express = require("express");
const { query } = require("../config/db");
const { requireAuth, requireResource } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");
const { exportContent } = require("../db/export-content");
const fs = require("fs");

const router = express.Router();

const WRITABLE_FIELDS = [
  "name", "tagline", "description", "founded_year", "email", "support_email", "phone",
  "address", "hours", "website", "logo_url", "favicon_url",
  "social_facebook", "social_telegram", "social_linkedin", "social_tiktok", "social_youtube",
  "footer_note", "copyright_text", "mission", "vision", "story",
  "seo_default_title", "seo_default_description", "og_default_image_url"
];

router.get("/", requireAuth, requireResource("pages"), asyncHandler(async (req, res) => {
  const result = await query("SELECT * FROM company_settings WHERE id = 1");
  res.json({ data: result.rows[0] });
}));

router.put("/", requireAuth, requireResource("pages"), asyncHandler(async (req, res) => {
  const fields = WRITABLE_FIELDS.filter((f) => req.body[f] !== undefined);
  if (!fields.length) return res.status(400).json({ error: "No valid fields provided." });

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = fields.map((f) => req.body[f]);
  const result = await query(
    `UPDATE company_settings SET ${setClause} WHERE id = 1 RETURNING *`,
    values
  );
  res.json({ data: result.rows[0], message: "Settings saved successfully." });
}));

router.post("/export", requireAuth, requireResource("pages"), asyncHandler(async (req, res) => {
  const filePath = await exportContent();
  res.download(filePath, "thutechcom-content-export.json", (err) => {
    if (!err) fs.unlink(filePath, () => {});
  });
}));

module.exports = router;
