require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const quoteRoutes = require("./routes/quotes");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/uploads");
const contactRoutes = require("./routes/contact");

const app = express();

connectDB();

// Accept the configured CLIENT_URL, its www/non-www counterpart, and localhost for dev.
const configuredOrigin = process.env.CLIENT_URL;
const allowedOrigins = configuredOrigin
  ? [
      configuredOrigin,
      configuredOrigin.includes("://www.")
        ? configuredOrigin.replace("://www.", "://")
        : configuredOrigin.replace("://", "://www."),
      "http://localhost:5173",
    ]
  : "*";

app.use(
  cors({
    origin: allowedOrigins === "*" ? "*" : allowedOrigins,
  })
);
// Raised from the default 100kb so a product with a couple of embedded
// base64 photos (from the admin upload feature) can still be saved.
app.use(express.json({ limit: "15mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
