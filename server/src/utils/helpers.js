// server/src/utils/helpers.js
const slugify = require("slugify");

/** Wraps an async route handler so rejected promises reach the error middleware. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Generates a URL-safe slug, e.g. "Web Development" -> "web-development". */
const toSlug = (text) => slugify(String(text || ""), { lower: true, strict: true });

/** Ensures a value is a JSON array (used for JSONB list columns like `problems`, `features`). */
const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      // Fall back to newline-separated plain text (what the admin textareas send)
      return value.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

/** Standard paginated list response shape. */
const paginate = (rows, total, page, pageSize) => ({
  data: rows,
  pagination: {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  }
});

module.exports = { asyncHandler, toSlug, asArray, paginate };
