const express = require("express");
const multer = require("multer");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Keep uploads in memory (not on disk) — Render's disk is wiped on every
// redeploy, so we convert straight to a base64 data URI and store that
// string in MongoDB, the same way a normal image URL is stored.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB per photo
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WEBP, or AVIF images are allowed"));
    }
    cb(null, true);
  },
});

// POST /api/uploads — admin only. Expects multipart/form-data with a single
// field named "image". Returns { url } where url is a data: URI that can be
// dropped straight into a product's images array.
router.post("/", requireAuth, requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image file received" });

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.json({ url: dataUri });
});

// Multer errors (file too large, bad type) land here instead of the generic handler.
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("Only JPEG")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
