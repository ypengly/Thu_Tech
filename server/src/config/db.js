// server/src/config/db.js
// Central PostgreSQL connection pool. Every query in the app goes through here.
// Credentials come only from environment variables — never hard-coded.

require("dotenv").config();
const { Pool } = require("pg");

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(connectionConfig);

pool.on("error", (err) => {
  // Unexpected errors on idle clients — log and let the process supervisor restart if needed.
  console.error("[db] Unexpected error on idle PostgreSQL client", err);
});

module.exports = {
  pool,
  /** Run a parameterized query. Always use placeholders ($1, $2, ...) — never string-concat input. */
  query: (text, params) => pool.query(text, params),
  /** Get a client for multi-statement transactions. Caller must release() it. */
  getClient: () => pool.connect()
};
