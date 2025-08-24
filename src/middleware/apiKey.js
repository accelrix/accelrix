const ApiError = require('../utils/apiError');

/**
 * API Key authentication middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new ApiError(403, 'Access denied. Invalid API key.'));
  }
  
  next();
};

module.exports = apiKeyMiddleware;