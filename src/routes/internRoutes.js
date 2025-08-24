// src/routes/internRoutes.js
const express = require("express");
const router = express.Router();
const internController = require("../controllers/internController");
const apiKeyMiddleware = require("../middleware/apiKey");
const refererMiddleware = require("../middleware/referer");

/**
 * @route   POST /api/interns/bulk-upsert
 * @desc    Bulk upsert internship users (requires API key)
 * @access  Private
 */
router.post("/bulk-upsert", apiKeyMiddleware, internController.bulkUpsert);

/**
 * @route   GET /api/interns/verify
 * @desc    Verify intern by ID (requires referer validation)
 * @access  Public (with referer check)
 */
router.get("/verify", refererMiddleware, internController.verifyIntern);

/**
 * @route   POST /api/interns/mark-status
 * @desc    Mark intern status (updates Google Sheets)
 * @access  Private (with API key)
 */
router.post(
  "/mark-status",
  apiKeyMiddleware,
  internController.markInternStatus
);

module.exports = router;
