// server/src/middleware/upload.js
// Handles file uploads (media library images, resumes, support attachments).
// Storage is behind a small interface (see storeFile/fileUrl) so swapping the
// STORAGE_DRIVER to "s3" later only requires changing this one file.

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});

const maxSize = (Number(process.env.MAX_UPLOAD_SIZE_MB) || 8) * 1024 * 1024;

function fileFilter(allowedTypes) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  };
}

const uploadImage = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES)
});

const uploadDocument = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter([...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES])
});

/** Public URL for a locally stored file. Swap this out for an S3/CDN URL builder later. */
function fileUrl(filename) {
  return `/uploads/${filename}`;
}

module.exports = { uploadImage, uploadDocument, fileUrl, UPLOAD_DIR };
