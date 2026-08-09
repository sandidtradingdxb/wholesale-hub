const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { attachUserIfPresent, requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Strips pricing/stock info for anyone who isn't an approved buyer/admin.
function serializeProduct(product, user) {
  const base = {
    id: product._id,
    sku: product.sku,
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    specs: product.specs,
    images: product.images,
    moq: product.moq,
    unit: product.unit,
  };

  const canViewPricing = user && typeof user.canViewPricing === "function" && user.canViewPricing();

  if (canViewPricing) {
    return {
      ...base,
      priceTiers: product.priceTiers,
      stockQty: product.stockQty,
    };
  }

  return {
    ...base,
    pricingLocked: true,
    priceHint: "Sign in with an approved wholesale account to see pricing",
  };
}

// GET /api/products — public browsing, optional filters: vertical, category, kind, search
router.get("/", attachUserIfPresent, async (req, res) => {
  try {
    const { vertical, category, kind, search, page = 1, limit = 24 } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    } else if (vertical || kind) {
      const catFilter = {};
      if (vertical) catFilter.vertical = vertical;
      if (kind) catFilter.kind = kind;
      const cats = await Category.find(catFilter).select("_id");
      filter.category = { $in: cats.map((c) => c._id) };
    }

    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products: products.map((p) => serializeProduct(p, req.user)),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load products", error: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", attachUserIfPresent, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product: serializeProduct(product, req.user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load product", error: err.message });
  }
});

// POST /api/products — admin only, create a product
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: "Failed to create product", error: err.message });
  }
});

// PUT /api/products/:id — admin only, update a product
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: "Failed to update product", error: err.message });
  }
});

// DELETE /api/products/:id — admin only, soft delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

module.exports = router;
