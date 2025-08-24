const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

// Import routes
const contactRoutes = require("./routes/contactRoutes");
const internRoutes = require("./routes/internRoutes");
const sheetRoutes = require("./routes/sheetRoutes");
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissionRoutes");


// Import middleware
const errorHandler = require("./middleware/errorHandler");
const { CORS_ORIGINS } = require("./config/constants");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  })
);

// Body parsing middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Accelrix API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/contact", contactRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/sheet", sheetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
