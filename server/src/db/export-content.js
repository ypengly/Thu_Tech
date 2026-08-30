// server/src/db/export-content.js
// Exports all CMS content as a single JSON file — used by the admin
// "Settings → Export Content" button (see routes/settings.routes.js) and
// callable directly with: npm run db:export
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool, query } = require("../config/db");

const TABLES = [
  "company_settings", "stats", "company_values", "why_choose_us", "process_steps",
  "services", "solutions", "projects", "products", "team_members", "testimonials",
  "clients", "careers", "blog_categories", "blog_posts", "faqs", "support_options"
];

async function exportContent() {
  const output = {};
  for (const table of TABLES) {
    const res = await query(`SELECT * FROM ${table} ORDER BY 1`);
    output[table] = res.rows;
  }
  output._exportedAt = new Date().toISOString();

  const outPath = path.join(__dirname, "..", "..", `content-export-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`[export] ✔ Wrote ${outPath}`);
  await pool.end();
  return outPath;
}

if (require.main === module) {
  exportContent().catch((err) => {
    console.error("[export] ✘ Failed:", err.message);
    process.exit(1);
  });
}

module.exports = { exportContent, TABLES };
