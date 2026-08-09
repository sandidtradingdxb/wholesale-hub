const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Top-level vertical this belongs to
    vertical: {
      type: String,
      enum: ["mobile", "computer", "camera"],
      required: true,
    },
    // e.g. "Phones" vs "Phone Accessories" within the mobile vertical
    kind: {
      type: String,
      enum: ["device", "accessory"],
      required: true,
    },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
