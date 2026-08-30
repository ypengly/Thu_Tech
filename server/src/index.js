// server/src/index.js
// Thu Tech com — application entry point.
// One Express server does three jobs:
//   1. Serves the public website  (../public)
//   2. Serves the admin dashboard (../admin) — protected by session auth
//   3. Serves the REST API        (/api/...)

require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { attachUser, requireAuthPage } = require("./middleware/auth");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const adminResourceRoutes = require("./routes/admin.resources.routes");
const settingsRoutes = require("./routes/settings.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const mediaRoutes = require("./routes/media.routes");
const messagesRoutes = require("./routes/messages.routes");
const supportRoutes = require("./routes/support.routes");
const applicationsRoutes = require("./routes/applications.routes");
const publicRoutes = require("./routes/public.routes");
const sitemapRoutes = require("./routes/sitemap.routes");

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
const ADMIN_DIR = path.join(__dirname, "..", "..", "admin");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const app = express();

// ---- Core middleware ----
app.set("trust proxy", 1);
app.use(
  helmet({
    // Tailwind/Lucide are loaded from CDNs by the existing static site — allow those origins.
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'"]
      }
    }
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

// ---- Uploaded media (public read; write is authenticated via /api/admin/media) ----
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));

// ---- API ----
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminResourceRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/messages", messagesRoutes);
app.use("/api/admin/support-requests", supportRoutes);
app.use("/api/admin/applications", applicationsRoutes);
app.use("/api/public", publicRoutes);
app.use("/", sitemapRoutes); // exposes GET /sitemap.xml

// ---- Admin dashboard (static files, but every HTML page requires a session) ----
app.get("/admin", (req, res) => res.redirect("/admin/index.html"));
app.get("/admin/index.html", requireAuthPage, (req, res) => res.sendFile(path.join(ADMIN_DIR, "index.html")));
app.get("/admin/:page.html", (req, res, next) => {
  if (req.params.page === "login") return res.sendFile(path.join(ADMIN_DIR, "login.html"));
  return requireAuthPage(req, res, () => res.sendFile(path.join(ADMIN_DIR, `${req.params.page}.html`)));
});
app.use("/admin", express.static(ADMIN_DIR)); // admin JS/CSS assets (not gated — they're useless without the API session)

// ---- Public website ----
// Clean URLs for detail pages: /services/:slug, /projects/:slug, /blog/:slug, /careers/:slug
// all reuse the existing *-detail.html templates; the template's script reads
// the slug from the URL path (falling back to ?id= for backward compatibility).
app.get("/services/:slug", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "service-detail.html")));
app.get("/projects/:slug", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "project-detail.html")));
app.get("/blog/:slug", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "blog-post.html")));
app.get("/careers/:slug", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "career-detail.html")));

app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

// ---- 404 ----
app.use("/api", notFoundHandler); // JSON 404 for unknown API routes
app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"))); // HTML 404 for everything else

// ---- Error handler (must be last) ----
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n  Thu Tech com server running → http://localhost:${PORT}`);
  console.log(`  Public website:   http://localhost:${PORT}/`);
  console.log(`  Admin dashboard:  http://localhost:${PORT}/admin/login.html`);
  console.log(`  API:              http://localhost:${PORT}/api\n`);
});

module.exports = app;
