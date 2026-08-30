// server/src/routes/sitemap.routes.js
// Generates sitemap.xml from published database content, so new services,
// projects, and blog posts are automatically included — drafts never are.

const express = require("express");
const { query } = require("../config/db");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

const STATIC_PAGES = [
  "", "about.html", "services.html", "solutions.html", "projects.html",
  "products.html", "careers.html", "blog.html", "contact.html", "support.html"
];

router.get("/sitemap.xml", asyncHandler(async (req, res) => {
  const base = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  const [services, projects, careers, blog] = await Promise.all([
    query("SELECT slug, updated_at FROM services WHERE status = 'published'"),
    query("SELECT slug, updated_at FROM projects WHERE status = 'published'"),
    query("SELECT slug, updated_at FROM careers WHERE status = 'published'"),
    query("SELECT slug, updated_at FROM blog_posts WHERE status = 'published'")
  ]);

  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: `${base}/${p}` })),
    ...services.rows.map((s) => ({ loc: `${base}/services/${s.slug}`, lastmod: s.updated_at })),
    ...projects.rows.map((p) => ({ loc: `${base}/projects/${p.slug}`, lastmod: p.updated_at })),
    ...careers.rows.map((c) => ({ loc: `${base}/careers/${c.slug}`, lastmod: c.updated_at })),
    ...blog.rows.map((b) => ({ loc: `${base}/blog/${b.slug}`, lastmod: b.updated_at }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}</url>`
  )
  .join("\n")}
</urlset>`;

  res.type("application/xml").send(xml);
}));

module.exports = router;
