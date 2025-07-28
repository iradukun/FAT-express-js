const express = require('express');
const { body } = require('express-validator');
const { managersController } = require('../controllers');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Update manager validation
const updateManagerValidation = [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('First name must be at most 50 characters'),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Last name must be at most 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManager, 
  managersController.getAllManagers
);

router.get('/:id', 
  authenticateToken, 
  authorizeManager, 
  managersController.getManagerById
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateManagerValidation, 
  handleValidationErrors, 
  managersController.updateManager
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  managersController.deleteManager
);

module.exports = router;