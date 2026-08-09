const express = require("express");
const QuoteRequest = require("../models/QuoteRequest");
const Product = require("../models/Product");
const { requireAuth, requireApprovedBuyer } = require("../middleware/auth");

const router = express.Router();

// POST /api/quotes — approved buyer submits a bulk order / quote request
router.post("/", requireAuth, requireApprovedBuyer, async (req, res) => {
  try {
    const { items, notes } = req.body; // items: [{ productId, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Add at least one product to request a quote" });
    }

    const lineItems = [];
    let estimatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      if (item.quantity < product.moq) {
        return res.status(400).json({
          message: `${product.name} has a minimum order quantity of ${product.moq} ${product.unit}`,
        });
      }
      const unitPrice = product.priceForQty(item.quantity);
      lineItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPriceAtRequest: unitPrice,
      });
      estimatedTotal += unitPrice * item.quantity;
    }

    const quote = await QuoteRequest.create({
      buyer: req.user._id,
      items: lineItems,
      notes,
      estimatedTotal,
    });

    res.status(201).json({ quote, message: "Quote request submitted. Our team will confirm pricing and availability shortly." });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit quote request", error: err.message });
  }
});

// GET /api/quotes/mine — buyer's own quote history
router.get("/mine", requireAuth, requireApprovedBuyer, async (req, res) => {
  const quotes = await QuoteRequest.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  res.json({ quotes });
});

module.exports = router;
