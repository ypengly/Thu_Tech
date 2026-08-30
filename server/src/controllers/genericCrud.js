// server/src/controllers/genericCrud.js
// A single, reusable CRUD implementation used by every "simple" content
// resource (services, solutions, projects, products, team, testimonials,
// clients, careers, faqs, blog categories, values, etc). This keeps the
// codebase DRY — one bug fix here fixes it everywhere — while each resource
// still gets its own routes/permissions via a small config object.
//
// Security note: `allowedFields` is a hard whitelist. Only columns listed
// there can ever be written from request input, no matter what the client
// sends — this prevents mass-assignment / SQL-injection-by-column-name.

const { query } = require("../config/db");
const { asyncHandler, toSlug, asArray } = require("../utils/helpers");

/**
 * @param {object} cfg
 * @param {string} cfg.table - table name (trusted, not user input)
 * @param {string[]} cfg.allowedFields - whitelist of writable columns
 * @param {string[]} [cfg.jsonFields] - columns stored as JSONB arrays/objects
 * @param {string[]} [cfg.searchFields] - columns included in ?search=
 * @param {string} [cfg.orderBy] - default ORDER BY clause
 * @param {boolean} [cfg.hasSlug] - auto-generate slug from `slugSource` if absent
 * @param {string} [cfg.slugSource] - field to derive the slug from
 * @param {boolean} [cfg.hasStatus] - table has a draft/published `status` column
 */
function createCrudController(cfg) {
  const {
    table,
    allowedFields,
    jsonFields = [],
    searchFields = [],
    orderBy = "sort_order ASC, created_at DESC",
    hasSlug = false,
    slugSource = "title",
    hasStatus = false
  } = cfg;

  function normalizeInput(body) {
    const out = {};
    for (const field of allowedFields) {
      if (body[field] === undefined) continue;
      out[field] = jsonFields.includes(field) ? JSON.stringify(asArray(body[field])) : body[field];
    }
    return out;
  }

  const list = asyncHandler(async (req, res) => {
    const { status, search, page = 1, pageSize = 50, publishedOnly } = req.query;
    const clauses = [];
    const params = [];

    if (hasStatus && status) {
      params.push(status);
      clauses.push(`status = $${params.length}`);
    }
    if (hasStatus && publishedOnly === "true") {
      clauses.push(`status = 'published'`);
    }
    if (search && searchFields.length) {
      params.push(`%${search}%`);
      clauses.push(`(${searchFields.map((f) => `${f} ILIKE $${params.length}`).join(" OR ")})`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const limit = Math.min(Number(pageSize) || 50, 200);
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const countRes = await query(`SELECT COUNT(*)::int AS count FROM ${table} ${where}`, params);
    const dataRes = await query(
      `SELECT * FROM ${table} ${where} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    res.json({
      data: dataRes.rows,
      pagination: { page: Number(page), pageSize: limit, total: countRes.rows[0].count }
    });
  });

  const getById = asyncHandler(async (req, res) => {
    const result = await query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Not found." });
    res.json({ data: result.rows[0] });
  });

  const getBySlug = asyncHandler(async (req, res) => {
    const conditions = hasStatus ? "slug = $1 AND status = 'published'" : "slug = $1";
    const result = await query(`SELECT * FROM ${table} WHERE ${conditions}`, [req.params.slug]);
    if (!result.rows.length) return res.status(404).json({ error: "Not found." });
    res.json({ data: result.rows[0] });
  });

  const create = asyncHandler(async (req, res) => {
    const input = normalizeInput(req.body);
    if (hasSlug && !input.slug) {
      input.slug = toSlug(req.body[slugSource] || `${table}-${Date.now()}`);
    }
    const fields = Object.keys(input);
    if (!fields.length) return res.status(400).json({ error: "No valid fields provided." });

    const columns = fields.join(", ");
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
    const values = fields.map((f) => input[f]);

    const result = await query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json({ data: result.rows[0], message: "Created successfully." });
  });

  const update = asyncHandler(async (req, res) => {
    const input = normalizeInput(req.body);
    const fields = Object.keys(input);
    if (!fields.length) return res.status(400).json({ error: "No valid fields provided." });

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const values = fields.map((f) => input[f]);
    values.push(req.params.id);

    const result = await query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found." });
    res.json({ data: result.rows[0], message: "Saved successfully." });
  });

  const remove = asyncHandler(async (req, res) => {
    const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Not found." });
    res.json({ message: "Deleted successfully." });
  });

  const setStatus = asyncHandler(async (req, res) => {
    if (!hasStatus) return res.status(400).json({ error: "This resource has no status field." });
    const { status } = req.body;
    const result = await query(
      `UPDATE ${table} SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found." });
    res.json({ data: result.rows[0], message: `Status updated to "${status}".` });
  });

  const reorder = asyncHandler(async (req, res) => {
    const { order } = req.body; // array of { id, sort_order }
    if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array." });
    for (const item of order) {
      await query(`UPDATE ${table} SET sort_order = $1 WHERE id = $2`, [item.sort_order, item.id]);
    }
    res.json({ message: "Order updated." });
  });

  return { list, getById, getBySlug, create, update, remove, setStatus, reorder };
}

module.exports = { createCrudController };
