const axios = require("axios");
const ApiError = require("../utils/apiError");
const { GOOGLE } = require("../config/constants");

/**
 * Service for Google Sheets operations
 */
class GoogleSheetsService {
  constructor() {
    this.sheetApiUrl = GOOGLE.SCRIPT_URL;

    if (!this.sheetApiUrl) {
      console.warn("⚠️ Google Sheets API URL not configured");
    }
  }

  /**
   * Update intern status in Google Sheets
   * @param {string} internId - Intern ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Response data
   */
  async updateInternStatus(internId, status) {
    if (!internId || status === undefined) {
      throw new ApiError(400, "Intern ID and status are required");
    }

    if (!this.sheetApiUrl) {
      throw new ApiError(500, "Google Sheets service not configured");
    }

    try {
      const response = await axios.post(this.sheetApiUrl, {
        internId,
        updates: { status },
      });

      return response.data;
    } catch (error) {
      console.error("Google Sheets update error:", error);
      throw new ApiError(500, "Failed to update Google Sheets");
    }
  }

  /**
   * Fetch all sheet data
   * @returns {Promise<Object>} Sheet data
   */
  async fetchSheetData() {
    if (!this.sheetApiUrl) {
      throw new ApiError(500, "Google Sheets service not configured");
    }

    try {
      const response = await axios.get(this.sheetApiUrl);
      return response.data;
    } catch (error) {
      console.error("Google Sheets fetch error:", error);
      throw new ApiError(500, "Failed to fetch data from Google Sheets");
    }
  }

  /**
   * Update sheet with multiple fields
   * @param {string} internId - Intern ID
   * @param {Object} updates - Key-value pairs to update
   * @returns {Promise<Object>} Response data
   */
  async updateSheet(internId, updates) {
    if (!internId || !updates || typeof updates !== "object") {
      throw new ApiError(400, "Intern ID and updates object are required");
    }

    if (!this.sheetApiUrl) {
      throw new ApiError(500, "Google Sheets service not configured");
    }

    try {
      const response = await axios.post(this.sheetApiUrl, {
        internId,
        updates,
      });

      return response.data;
    } catch (error) {
      console.error("Google Sheets update error:", error);
      throw new ApiError(500, "Failed to update Google Sheets");
    }
  }
}

module.exports = new GoogleSheetsService();
