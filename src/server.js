const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
app.use(compression());

// Serve the static dashboard
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

// Health check endpoint (useful for Railway's health checks)
app.get("/health", (req, res) => res.status(200).json({ status: "ok", project: "k-asar" }));

// SPA-style fallback so any route serves the dashboard
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`K-asar dashboard running on port ${PORT}`);
});
