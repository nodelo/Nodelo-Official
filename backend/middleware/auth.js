const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware - Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Authorization header must be: Bearer <token>',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Optional authentication - Doesn't fail if no token, but attaches user if valid token exists
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore errors for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};

