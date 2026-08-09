const mongoose = require("mongoose");

const lineItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: String, // snapshot at time of request
    sku: String,
    quantity: { type: Number, required: true },
    unitPriceAtRequest: Number,
  },
  { _id: false }
);

const quoteRequestSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [lineItemSchema], required: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "quoted", "confirmed", "cancelled"],
      default: "submitted",
    },
    adminResponse: { type: String, trim: true },
    estimatedTotal: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);
