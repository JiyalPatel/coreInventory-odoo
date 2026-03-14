require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./configs/db");
const errorMiddleware = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const locationRoutes = require("./routes/location.routes");
const productRoutes = require("./routes/product.routes");
const operationRoutes = require("./routes/operation.routes");
const moveHistoryRoutes = require("./routes/moveHistory.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const transferRoutes = require("./routes/transfer.routes");

const app = express();

// ── Core Middleware ──────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "process.env.CLIENT_URL || 'http://localhost:5000',",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/move-history", moveHistoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transfers", transferRoutes);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "CoreInventory API is running" });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CoreInventory server running on http://localhost:${PORT}`);
  });
});
