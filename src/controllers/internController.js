// src/controllers/internController.js
const InternshipUser = require("../models/InternshipUser");
const googleSheetsService = require("../services/googleSheetsService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

/**
 * Internship user management controller
 */
const internController = {
  /**
   * Bulk upsert internship users
   */
  bulkUpsert: asyncHandler(async (req, res) => {
    const { interns } = req.body;

    const results = await Promise.all(
      interns.map(async (intern) => {
        return await InternshipUser.findOneAndUpdate(
          { "personalDetails.email": intern.personalDetails.email }, // find by nested email
          { $set: intern }, // update the whole document
          { upsert: true, new: true, strict: false } // allow fields outside schema if needed
        );
      })
    );

    res.status(200).json({
      success: true,
      message: `Bulk upsert completed for ${results.length} interns`,
      data: results,
    });
  }),

  /**
   * Verify intern by ID
   */
  verifyIntern: asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
      throw new ApiError(400, "Intern ID is required");
    }

    // ✅ Search using internId field, not _id
    const intern = await InternshipUser.findOne({ internId: id });

    if (!intern) {
      throw new ApiError(404, "Intern not found");
    }

    res.status(200).json({
      success: true,
      message: "Intern verified successfully",
      data: {
        name: intern.personalDetails.fullName,
        internId: intern.internId,
        domain: intern.internshipDetails.internshipTrack,
        college: intern.personalDetails.collegeName,
        startDate: intern.internshipDetails.startDate
          ? new Date(intern.internshipDetails.startDate).toLocaleDateString(
              "en-IN"
            )
          : null,
        endDate: intern.internshipDetails.endDate
          ? new Date(intern.internshipDetails.endDate).toLocaleDateString(
              "en-IN"
            )
          : null,
        issueDate: intern.internshipDetails.certificateIssueDate
          ? new Date(
              intern.internshipDetails.certificateIssueDate
            ).toLocaleDateString("en-IN")
          : null,
      },
    });
  }),

  /**
   * Mark intern status (updates Google Sheets)
   */
  markInternStatus: asyncHandler(async (req, res) => {
    const { internId, status } = req.body;

    const result = await googleSheetsService.updateInternStatus(
      internId,
      status
    );

    res.json({ success: true, data: result });
  }),
};

module.exports = internController;
