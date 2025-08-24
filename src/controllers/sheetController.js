const googleSheetsService = require("../services/googleSheetsService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

/**
 * Google Sheets operations controller
 */
const sheetController = {
  /**
   * Fetch all sheet data
   */
  getSheetData: asyncHandler(async (req, res) => {
    const data = await googleSheetsService.fetchSheetData();
    res.json(data);
  }),

  /**
   * Update sheet data by internId
   */
  updateSheetData: asyncHandler(async (req, res, next) => {
    const { internId, updates } = req.body;

    if (!internId || !updates) {
      return next(new ApiError(400, "Intern ID and updates are required"));
    }

    try {
      const result = await googleSheetsService.updateSheet(internId, updates);
      res.json({
        success: true,
        message: "Sheet updated successfully",
        data: result,
      });
    } catch (error) {
      return next(new ApiError(500, "Failed to update sheet", error));
    }
  }),
};

module.exports = sheetController;
