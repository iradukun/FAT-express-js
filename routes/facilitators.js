const express = require('express');
const { body } = require('express-validator');
const { facilitatorsController } = require('../controllers');
const { authenticateToken, authorizeManager, authorizeManagerOrFacilitator } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Update facilitator validation
const updateFacilitatorValidation = [
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
  body('employeeId')
    .optional()
    .notEmpty()
    .withMessage('Employee ID cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Employee ID must be at most 20 characters'),
  body('department')
    .optional()
    .notEmpty()
    .withMessage('Department cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Department must be at most 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManager, 
  facilitatorsController.getAllFacilitators
);

router.get('/:id', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  facilitatorsController.getFacilitatorById
);

router.get('/:id/assignments', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  facilitatorsController.getFacilitatorAssignments
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateFacilitatorValidation, 
  handleValidationErrors, 
  facilitatorsController.updateFacilitator
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  facilitatorsController.deleteFacilitator
);

module.exports = router;