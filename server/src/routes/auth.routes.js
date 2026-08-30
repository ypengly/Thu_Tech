// server/src/routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const { query } = require("../config/db");
const { signToken, COOKIE_NAME, requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: (Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." }
});

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const result = await query("SELECT * FROM users WHERE email = $1 AND is_active = true", [
      String(email).toLowerCase().trim()
    ]);
    const user = result.rows[0];

    // Always run bcrypt.compare (even on missing user) to avoid timing attacks revealing valid emails.
    const validHash = user ? user.password_hash : "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsal";
    const isValid = await bcrypt.compare(password, validHash);

    if (!user || !isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    await query("UPDATE users SET last_login_at = now() WHERE id = $1", [user.id]);

    const token = signToken(user);
    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.json({
      message: "Logged in successfully.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logged out successfully." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
