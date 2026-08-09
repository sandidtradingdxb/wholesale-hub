const mongoose = require("mongoose");

// Bulk pricing breaks — e.g. buy 1-9 units at one price, 10-49 at a lower price, etc.
const priceTierSchema = new mongoose.Schema(
  {
    minQty: { type: Number, required: true },
    maxQty: { type: Number }, // omit for "and above"
    pricePerUnit: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    description: { type: String, trim: true },
    specs: [{ label: String, value: String }], // freeform spec sheet rows

    images: [{ type: String }], // image URLs

    // Wholesale-specific fields
    moq: { type: Number, required: true, default: 1 }, // minimum order quantity
    unit: { type: String, default: "pcs" }, // pcs, box, carton, etc.
    priceTiers: {
      type: [priceTierSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    stockQty: { type: Number, required: true, default: 0 },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", sku: "text" });

// Given a requested quantity, find the matching price tier
productSchema.methods.priceForQty = function (qty) {
  const tier = this.priceTiers
    .filter((t) => qty >= t.minQty && (!t.maxQty || qty <= t.maxQty))
    .sort((a, b) => b.minQty - a.minQty)[0];
  return tier ? tier.pricePerUnit : this.priceTiers[0].pricePerUnit;
};

module.exports = mongoose.model("Product", productSchema);
