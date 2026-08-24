const express = require("express");
const QuoteRequest = require("../models/QuoteRequest");
const Product = require("../models/Product");
const { requireAuth, requireApprovedBuyer } = require("../middleware/auth");
const { sendNotification } = require("../utils/mailer");

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

    const itemsText = lineItems
      .map((li) => `${li.productName} (${li.sku}) — ${li.quantity} × AED ${li.unitPriceAtRequest.toFixed(2)}`)
      .join("\n");
    const itemsHtml = lineItems
      .map((li) => `<li>${li.productName} (${li.sku}) — ${li.quantity} × AED ${li.unitPriceAtRequest.toFixed(2)}</li>`)
      .join("");

    sendNotification({
      subject: `New quote request — ${req.user.businessName || req.user.fullName}`,
      html: `
        <h2>New quote request</h2>
        <p><strong>Buyer:</strong> ${req.user.fullName} (${req.user.businessName || "-"})</p>
        <p><strong>Email:</strong> ${req.user.email}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Estimated total:</strong> AED ${estimatedTotal.toFixed(2)}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      `,
      text: `New quote request\n\nBuyer: ${req.user.fullName} (${req.user.businessName || "-"})\nEmail: ${req.user.email}\n\n${itemsText}\n\nEstimated total: AED ${estimatedTotal.toFixed(2)}\n${notes ? `\nNotes: ${notes}` : ""}`,
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
