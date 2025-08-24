const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { JWT } = require("../config/constants");

/**
 * Authentication controller
 */
const authController = {
  /**
   * Handle user login
   */
  login: asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new ApiError(400, "Username and password are required"));
    }

    if (username !== process.env.LOGIN_USER) {
      return next(new ApiError(401, "Invalid username"));
    }

    if (password !== process.env.LOGIN_PASS) {
      return next(new ApiError(401, "Incorrect password"));
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: JWT.EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        username,
        expiresIn: "1h",
      },
    });
  }),
};

module.exports = authController;
