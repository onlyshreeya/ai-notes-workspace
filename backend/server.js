const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
require("dotenv").config();

const connectDB   = require("./config/db");
const authRoutes  = require("./routes/authRoutes");
const noteRoutes  = require("./routes/noteRoutes");

const app = express();

// ── Security & Middleware ────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/notes", noteRoutes);   // AI generate-summary lives under /api/notes/:id/generate-summary

// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "OK", message: "Peblo Workplace API" }));

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ── Connect DB then start ────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
