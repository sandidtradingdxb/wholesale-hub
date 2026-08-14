require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

// Note: sample prices below are placeholder numbers for demo purposes, shown as AED
// in the UI. Update them to your real AED price lists before going live.
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding...");

  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const categories = await Category.insertMany([
    { name: "Smartphones", slug: "smartphones", vertical: "mobile", kind: "device" },
    { name: "Phone Accessories", slug: "phone-accessories", vertical: "mobile", kind: "accessory" },
    { name: "Laptops & Desktops", slug: "laptops-desktops", vertical: "computer", kind: "device" },
    { name: "Computer Accessories", slug: "computer-accessories", vertical: "computer", kind: "accessory" },
    { name: "Cameras", slug: "cameras", vertical: "camera", kind: "device" },
    { name: "Camera Accessories", slug: "camera-accessories", vertical: "camera", kind: "accessory" },
  ]);

  const byslug = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  await Product.insertMany([
    {
      sku: "MOB-1001",
      name: "AuraX 12 Pro Smartphone (128GB)",
      brand: "AuraX",
      category: byslug["smartphones"],
      description: "Mid-range Android smartphone, 6.5in AMOLED, dual SIM, popular reseller SKU.",
      specs: [{ label: "Storage", value: "128GB" }, { label: "RAM", value: "6GB" }],
      images: ["https://images.unsplash.com/photo-1672413514634-4781b15fd89e?auto=format&fit=crop&w=800&q=80"],
      moq: 10,
      unit: "pcs",
      priceTiers: [
        { minQty: 10, maxQty: 49, pricePerUnit: 189 },
        { minQty: 50, maxQty: 199, pricePerUnit: 175 },
        { minQty: 200, pricePerUnit: 162 },
      ],
      stockQty: 860,
      isFeatured: true,
    },
    {
      sku: "MOB-ACC-2001",
      name: "Tempered Glass Screen Protector (Universal Pack of 100)",
      brand: "ShieldPro",
      category: byslug["phone-accessories"],
      description: "Bulk pack of tempered glass protectors, mixed sizes for common phone models.",
      specs: [{ label: "Pack size", value: "100 units" }],
      images: ["https://images.unsplash.com/photo-1567428486597-8c5328fd3816?auto=format&fit=crop&w=800&q=80"],
      moq: 5,
      unit: "case",
      priceTiers: [
        { minQty: 5, maxQty: 19, pricePerUnit: 42 },
        { minQty: 20, pricePerUnit: 36 },
      ],
      stockQty: 300,
    },
    {
      sku: "CPU-3001",
      name: "NovaBook 14 Business Laptop (i5/16GB/512GB)",
      brand: "NovaBook",
      category: byslug["laptops-desktops"],
      description: "Business-grade laptop, ideal for corporate bulk orders and refurb resellers.",
      specs: [{ label: "CPU", value: "Intel i5 12th gen" }, { label: "RAM", value: "16GB" }],
      images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"],
      moq: 5,
      unit: "pcs",
      priceTiers: [
        { minQty: 5, maxQty: 24, pricePerUnit: 549 },
        { minQty: 25, pricePerUnit: 519 },
      ],
      stockQty: 210,
      isFeatured: true,
    },
    {
      sku: "CPU-ACC-4001",
      name: "USB-C Multiport Hub (7-in-1)",
      brand: "LinkGear",
      category: byslug["computer-accessories"],
      description: "HDMI, USB 3.0 x3, SD/microSD, PD passthrough. Popular laptop bundle add-on.",
      specs: [],
      images: ["https://images.unsplash.com/photo-1616578273461-3a99ce422de6?auto=format&fit=crop&w=800&q=80"],
      moq: 20,
      unit: "pcs",
      priceTiers: [
        { minQty: 20, maxQty: 99, pricePerUnit: 14.5 },
        { minQty: 100, pricePerUnit: 11.9 },
      ],
      stockQty: 1500,
    },
    {
      sku: "CAM-5001",
      name: "Vistara M50 Mirrorless Camera Body",
      brand: "Vistara",
      category: byslug["cameras"],
      description: "24MP APS-C mirrorless body, popular with mid-tier photography retailers.",
      specs: [{ label: "Sensor", value: "24MP APS-C" }],
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"],
      moq: 3,
      unit: "pcs",
      priceTiers: [
        { minQty: 3, maxQty: 9, pricePerUnit: 620 },
        { minQty: 10, pricePerUnit: 585 },
      ],
      stockQty: 95,
      isFeatured: true,
    },
    {
      sku: "CAM-ACC-6001",
      name: "Aluminum Tripod 65in (Carton of 12)",
      brand: "SteadyPro",
      category: byslug["camera-accessories"],
      description: "Lightweight aluminum tripods, ball head, carry case included per unit.",
      specs: [],
      images: ["https://images.unsplash.com/photo-1594147216879-97803adfb44d?auto=format&fit=crop&w=800&q=80"],
      moq: 2,
      unit: "carton",
      priceTiers: [
        { minQty: 2, maxQty: 9, pricePerUnit: 210 },
        { minQty: 10, pricePerUnit: 189 },
      ],
      stockQty: 140,
    },
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourcompany.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      fullName: "Site Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "changeme123",
      phone: "0000000000",
      businessName: "Platform Admin",
      role: "admin",
      approvalStatus: "approved",
    });
    console.log(`Admin created: ${adminEmail}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
