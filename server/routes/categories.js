const express = require("express");
const Category = require("../models/Category");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/categories — public, used to build nav menus
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ vertical: 1, kind: 1, name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Failed to load categories", error: err.message });
  }
});

// POST /api/categories — admin only
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    res.status(400).json({ message: "Failed to create category", error: err.message });
  }
});

module.exports = router;
