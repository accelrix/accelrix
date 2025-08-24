const InternshipUser = require("../models/InternshipUser");

exports.upsertSubmission = async (req, res) => {
  try {
    const { internId, ...submissionData } = req.body;

    if (!internId) {
      return res
        .status(400)
        .json({ success: false, message: "Intern ID is required" });
    }

    // Build update object with dot notation
    const updateObj = {};
    for (const [key, value] of Object.entries(submissionData)) {
      updateObj[`submission.${key}`] = value;
    }

    const updatedIntern = await InternshipUser.findOneAndUpdate(
      { internId },
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    if (!updatedIntern) {
      return res
        .status(404)
        .json({ success: false, message: "Intern not found" });
    }

    res.status(200).json({
      success: true,
      message: "Submission upserted successfully",
      data: updatedIntern,
    });
  } catch (err) {
    console.error("❌ Error upserting submission:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
