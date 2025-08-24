const mongoose = require("mongoose");

/**
 * Submission schema for internship tasks
 */
const submissionSchema = new mongoose.Schema({
  tasks: {
    linkedinPosts: {
      task1: { type: String, trim: true },
      task2: { type: String, trim: true },
      task3: { type: String, trim: true },
      task4: { type: String, trim: true },
      task5: { type: String, trim: true },
    },
    githubRepos: {
      task1: { type: String, trim: true },
      task2: { type: String, trim: true },
      task3: { type: String, trim: true },
      task4: { type: String, trim: true },
      task5: { type: String, trim: true },
    },
  },
  socialFollow: { type: String, trim: true },
  paymentScreenshot: { type: String, trim: true },
  finalConfirmation: { type: String, trim: true },
  timestamp: { type: Date, default: Date.now },
});

/**
 * Internship user schema
 */
const internshipUserSchema = new mongoose.Schema(
  {
    internId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    personalDetails: {
      fullName: { type: String, trim: true },
      gender: { type: String, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email",
        ],
      },
      mobileNumber: { type: String, trim: true },
      highestAcademicQualification: { type: String, trim: true },
      collegeName: { type: String, trim: true },
      passingYear: {
        type: Number,
        min: [1900, "Passing year must be after 1900"],
        max: [
          new Date().getFullYear() + 5,
          "Passing year cannot be in the distant future",
        ],
      },
      country: { type: String, trim: true },
    },
    internshipDetails: {
      internshipTrack: { type: String, trim: true },
      startDate: { type: Date },
      endDate: { type: Date },
      offerLetterIssueDate: { type: Date },
      certificateIssueDate: { type: Date },
      offerLetterSentStatus: { type: String, trim: true },
      certificateSentStatus: { type: String, trim: true },
      internshipCompleted: { type: String, trim: true },
    },
    joinedLinkedIn: { type: String, trim: true },
    questions: { type: String, trim: true },
    submission: submissionSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
internshipUserSchema.index({ "personalDetails.email": 1 });
internshipUserSchema.index({ internId: 1 });
internshipUserSchema.index({ "internshipDetails.internshipTrack": 1 });

module.exports = mongoose.model(
  "InternshipUser",
  internshipUserSchema,
  "internship-users-2025"
);
