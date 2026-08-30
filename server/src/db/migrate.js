// server/src/db/migrate.js
// Runs schema.sql against the configured database. Safe to re-run.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  console.log("[migrate] Connecting to database...");
  const client = await pool.connect();
  try {
    console.log("[migrate] Running schema.sql ...");
    await client.query(sql);
    console.log("[migrate] ✔ Schema is up to date.");
  } finally {
    client.release();
  }
  await pool.end();
}

migrate().catch((err) => {
  console.error("[migrate] ✘ Migration failed:", err.message);
  process.exit(1);
});
