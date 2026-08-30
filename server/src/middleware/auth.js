// server/src/middleware/auth.js
// Authentication & authorization. The JWT is stored in an httpOnly cookie
// (not accessible to JS / localStorage), so it can't be stolen via XSS.
// The backend is the single source of truth for authorization — the admin
// UI hides buttons the user can't use, but every action is re-checked here.

const jwt = require("jsonwebtoken");

const COOKIE_NAME = process.env.COOKIE_NAME || "thutechcom_session";

// Role → permission map. "super_admin" implicitly has every permission.
const ROLE_RESOURCES = {
  content_manager: ["pages", "services", "projects", "products", "blog", "faqs", "team", "testimonials", "media"],
  hr_manager: ["careers", "applications"],
  support_manager: ["support_requests", "contact_messages"]
};

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function readTokenFromRequest(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Attaches req.user if a valid session exists; does NOT block the request. */
function attachUser(req, res, next) {
  const token = readTokenFromRequest(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // invalid/expired token — treat as logged out rather than erroring
  }
  next();
}

/** Blocks the request unless a valid session is present. */
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized. Please log in." });
  next();
}

/** Blocks the request unless the user's role can access `resource`. */
function requireResource(resource) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized. Please log in." });
    if (req.user.role === "super_admin") return next();
    const allowed = ROLE_RESOURCES[req.user.role] || [];
    if (!allowed.includes(resource)) {
      return res.status(403).json({ error: "You do not have permission to access this resource." });
    }
    next();
  };
}

/** For pages (not API): redirects to /admin/login instead of returning JSON. */
function requireAuthPage(req, res, next) {
  if (!req.user) return res.redirect("/admin/login.html");
  next();
}

module.exports = {
  COOKIE_NAME,
  signToken,
  attachUser,
  requireAuth,
  requireResource,
  requireAuthPage
};
