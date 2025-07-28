const jwt = require('jsonwebtoken');
const { Manager, Facilitator } = require('../models');
const { errorResponse } = require('../utils');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details based on role
    let user;
    if (decoded.role === 'manager') {
      user = await Manager.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } else if (decoded.role === 'facilitator') {
      user = await Facilitator.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    }

    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or inactive', 401);
    }

    req.user = { ...user.toJSON(), role: decoded.role };
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 403);
  }
};

const authorizeManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return errorResponse(res, 'Manager access required', 403);
  }
  next();
};

const authorizeFacilitator = (req, res, next) => {
  if (req.user.role !== 'facilitator') {
    return errorResponse(res, 'Facilitator access required', 403);
  }
  next();
};

const authorizeManagerOrFacilitator = (req, res, next) => {
  if (req.user.role !== 'manager' && req.user.role !== 'facilitator') {
    return errorResponse(res, 'Manager or facilitator access required', 403);
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeManager,
  authorizeFacilitator,
  authorizeManagerOrFacilitator
};