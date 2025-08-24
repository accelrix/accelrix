const express = require("express");
const router = express.Router();
const { upsertSubmission } = require("../controllers/submissionController");

// Upsert submission for an intern
router.post("/upsert", upsertSubmission);

module.exports = router;
