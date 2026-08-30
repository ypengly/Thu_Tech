// server/src/db/seed-admin.js
// Creates (or updates) the initial Super Admin account from environment
// variables. Run with: npm run db:seed:admin
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool, query } = require("../config/db");

async function seedAdmin() {
  const name = process.env.SEED_ADMIN_NAME || "Site Administrator";
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@thutechcom.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be set in .env and be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows.length > 0) {
    await query(
      `UPDATE users SET name = $1, password_hash = $2, role = 'super_admin', is_active = true
       WHERE email = $3`,
      [name, passwordHash, email]
    );
    console.log(`[seed-admin] ✔ Updated existing admin account: ${email}`);
  } else {
    await query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, 'super_admin', true)`,
      [name, email, passwordHash]
    );
    console.log(`[seed-admin] ✔ Created super admin account: ${email}`);
  }

  console.log("[seed-admin] You can now log in at /admin/login with this email and the password from .env.");
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error("[seed-admin] ✘ Failed:", err.message);
  process.exit(1);
});
