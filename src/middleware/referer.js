const ApiError = require("../utils/apiError");

/**
 * Referer validation middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const refererMiddleware = (req, res, next) => {
  const referer = req.get("Referer") || "";
  const allowedOrigin = "https://accelrix-buildbeyond.web.app";

  if (!referer.startsWith(allowedOrigin)) {
    return next(new ApiError(403, "Unauthorized source."));
  }

  next();
};

module.exports = refererMiddleware;
