// server/src/routes/dashboard.routes.js
const express = require("express");
const { query } = require("../config/db");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const counts = await Promise.all([
    query("SELECT COUNT(*)::int AS n FROM projects"),
    query("SELECT COUNT(*)::int AS n FROM services"),
    query("SELECT COUNT(*)::int AS n FROM blog_posts"),
    query("SELECT COUNT(*)::int AS n FROM contact_messages WHERE status = 'new'"),
    query("SELECT COUNT(*)::int AS n FROM job_applications WHERE status = 'new'"),
    query("SELECT COUNT(*)::int AS n FROM support_requests WHERE status IN ('open','in_progress')"),
    query("SELECT COUNT(*)::int AS n FROM products"),
    query("SELECT COUNT(*)::int AS n FROM careers WHERE status = 'published'")
  ]);

  const recentMessages = await query(
    "SELECT id, name, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5"
  );
  const recentApplications = await query(
    "SELECT id, applicant_name, position_title, status, created_at FROM job_applications ORDER BY created_at DESC LIMIT 5"
  );

  res.json({
    data: {
      projects: counts[0].rows[0].n,
      services: counts[1].rows[0].n,
      blogPosts: counts[2].rows[0].n,
      newMessages: counts[3].rows[0].n,
      newApplications: counts[4].rows[0].n,
      openSupportRequests: counts[5].rows[0].n,
      products: counts[6].rows[0].n,
      publishedCareers: counts[7].rows[0].n,
      recentMessages: recentMessages.rows,
      recentApplications: recentApplications.rows
    }
  });
}));

module.exports = router;
