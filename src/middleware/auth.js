const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return next(new ApiError(401, 'Authorization header missing'));
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return next(new ApiError(401, 'Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(403, 'Invalid or expired token'));
  }
};

module.exports = authMiddleware;