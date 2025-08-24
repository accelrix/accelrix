const Contact = require("../models/Contact");
const emailService = require("../services/emailService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

/**
 * Contact form submission controller
 */
const contactController = {
  /**
   * Handle contact form submission
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  submitContactForm: asyncHandler(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return next(
        new ApiError(400, "Name, email, subject, and message are required")
      );
    }

    // Save to database
    const newMessage = new Contact({ name, email, phone, subject, message });
    await newMessage.save();

    // Send emails
    await emailService.sendContactEmails({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Message sent and saved successfully!",
      data: { id: newMessage._id },
    });
  }),
};

module.exports = contactController;
