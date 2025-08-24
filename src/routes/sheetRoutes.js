const express = require("express");
const router = express.Router();
const sheetController = require("../controllers/sheetController");

/**
 * @route   GET /api/sheet
 * @desc    Fetch all sheet data
 * @access  Public
 */
router.get("/", sheetController.getSheetData);

/**
 * @route   POST /api/sheet/update
 * @desc    Update sheet data by internId
 * @access  Public
 */
router.post("/update", sheetController.updateSheetData);

module.exports = router;
