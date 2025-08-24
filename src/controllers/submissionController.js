const InternshipUser = require("../models/InternshipUser");

exports.upsertSubmission = async (req, res) => {
  try {
    const { internId, submission } = req.body;

    if (!internId || !submission) {
      return res.status(400).json({
        success: false,
        message: "internId and submission are required",
      });
    }

    // Flatten submission object to dot notation
    const flatten = (obj, parent = "submission") => {
      let fields = {};
      for (const [key, value] of Object.entries(obj)) {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          fields = { ...fields, ...flatten(value, `${parent}.${key}`) };
        } else {
          fields[`${parent}.${key}`] = value;
        }
      }
      return fields;
    };

    const updateFields = flatten(submission);

    // Only update existing interns
    const updatedIntern = await InternshipUser.findOneAndUpdate(
      { internId }, // find existing
      { $set: updateFields }, // merge submission fields
      { new: true } // return updated doc
    );

    if (!updatedIntern) {
      return res
        .status(404)
        .json({ success: false, message: "Intern not found" });
    }

    res.json({
      success: true,
      message: "Submission updated",
      intern: updatedIntern,
    });
  } catch (err) {
    console.error("❌ Error in upsertSubmission:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
