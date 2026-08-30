// server/src/middleware/errorHandler.js

function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found." });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("[error]", err.message);

  if (err.code === "23505") { // unique_violation
    return res.status(409).json({ error: "A record with this value already exists (e.g. duplicate slug)." });
  }
  if (err.code === "23503") { // foreign_key_violation
    return res.status(409).json({ error: "This record is referenced elsewhere and cannot be changed." });
  }
  if (err instanceof multerErrorTypes) {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Something went wrong. Please try again." : err.message
  });
}

const multer = require("multer");
const multerErrorTypes = multer.MulterError;

module.exports = { notFoundHandler, errorHandler };
