const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Contact person
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },

    // Business details — required so we can vet the buyer before showing prices
    businessName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ["retailer", "distributor", "repair_shop", "reseller", "other"],
      default: "retailer",
    },
    taxId: { type: String, trim: true }, // GST / VAT / business registration number
    businessAddress: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Access control
    role: { type: String, enum: ["buyer", "admin"], default: "buyer" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },

    // Buyer-specific pricing tier, assigned by admin after approval
    pricingTier: {
      type: String,
      enum: ["standard", "silver", "gold", "platinum"],
      default: "standard",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Only admins and approved buyers should ever see wholesale prices
userSchema.methods.canViewPricing = function () {
  return this.role === "admin" || this.approvalStatus === "approved";
};

module.exports = mongoose.model("User", userSchema);
