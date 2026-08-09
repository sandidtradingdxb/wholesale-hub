const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the user to req.user. Rejects if missing/invalid.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Only lets admins through. Use after requireAuth.
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// Only lets approved buyers (or admins) through — used for pricing/ordering routes.
function requireApprovedBuyer(req, res, next) {
  if (!req.user.canViewPricing()) {
    return res.status(403).json({
      message: "Your business account is pending approval. You'll get an email once it's approved.",
      approvalStatus: req.user.approvalStatus,
    });
  }
  next();
}

// Attaches req.user if a valid token is present, but doesn't reject if absent.
// Used on catalog routes so guests can browse while approved buyers see prices.
async function attachUserIfPresent(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, requireAdmin, requireApprovedBuyer, attachUserIfPresent };
