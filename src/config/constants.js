/**
 * Application constants and configuration
 * Centralizes all configurable values for easy maintenance
 */

module.exports = {
  // CORS configuration
  CORS_ORIGINS: [
    "https://accelrix-buildbeyond.web.app",
    "http://localhost:3000",
  ],

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
  },

  // JWT configuration
  JWT: {
    EXPIRES_IN: "1h",
    ALGORITHM: "HS256",
  },

  // Google Sheets/Apps Script configuration
  GOOGLE: {
    SCRIPT_URL: process.env.GOOGLE_SHEET_API_URL || process.env.APPS_SCRIPT_URL,
  },

  // Validation messages
  VALIDATION: {
    REQUIRED_FIELDS: "All required fields must be provided",
    INVALID_CREDENTIALS: "Invalid credentials provided",
  },

  // HTTP Status messages
  HTTP: {
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    SERVER_ERROR: "Internal server error",
  },
};
