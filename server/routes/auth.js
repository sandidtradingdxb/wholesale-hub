const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    businessName: user.businessName,
    businessType: user.businessType,
    role: user.role,
    approvalStatus: user.approvalStatus,
    pricingTier: user.pricingTier,
  };
}

// POST /api/auth/register — business signs up, goes into "pending" until admin approves
router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("businessName").trim().notEmpty().withMessage("Business name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const existing = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existing) return res.status(409).json({ message: "An account with this email already exists" });

      const user = await User.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        businessName: req.body.businessName,
        businessType: req.body.businessType,
        taxId: req.body.taxId,
        businessAddress: req.body.businessAddress,
      });

      const token = signToken(user);
      res.status(201).json({
        token,
        user: publicUser(user),
        message: "Account created. It's pending review — we'll notify you once it's approved for wholesale pricing.",
      });
    } catch (err) {
      res.status(500).json({ message: "Registration failed", error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const match = await user.comparePassword(req.body.password);
      if (!match) return res.status(401).json({ message: "Invalid email or password" });

      const token = signToken(user);
      res.json({ token, user: publicUser(user) });
    } catch (err) {
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  }
);

// GET /api/auth/me — returns the logged-in user's profile
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
