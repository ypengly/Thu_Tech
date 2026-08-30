// server/src/routes/messages.routes.js
const express = require("express");
const { query } = require("../config/db");
const { requireAuth, requireResource } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();
const guard = requireResource("contact_messages");

router.get("/", requireAuth, guard, asyncHandler(async (req, res) => {
  const { status, page = 1, pageSize = 25 } = req.query;
  const clauses = [];
  const params = [];
  if (status) { params.push(status); clauses.push(`status = $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.min(Number(pageSize) || 25, 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const countRes = await query(`SELECT COUNT(*)::int AS count FROM contact_messages ${where}`, params);
  const dataRes = await query(
    `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params
  );
  res.json({ data: dataRes.rows, pagination: { page: Number(page), pageSize: limit, total: countRes.rows[0].count } });
}));

router.get("/:id", requireAuth, guard, asyncHandler(async (req, res) => {
  const result = await query("SELECT * FROM contact_messages WHERE id = $1", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  // Viewing a "new" message marks it read.
  if (result.rows[0].status === "new") {
    await query("UPDATE contact_messages SET status = 'read' WHERE id = $1", [req.params.id]);
    result.rows[0].status = "read";
  }
  res.json({ data: result.rows[0] });
}));

router.patch("/:id/status", requireAuth, guard, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "read", "replied", "archived"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const result = await query(
    "UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  res.json({ data: result.rows[0], message: "Status updated." });
}));

router.delete("/:id", requireAuth, guard, asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found." });
  res.json({ message: "Deleted successfully." });
}));

module.exports = router;
