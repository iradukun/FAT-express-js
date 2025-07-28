const express = require('express');
const { body } = require('express-validator');
const { cohortsController } = require('../controllers');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Create cohort validation
const createCohortValidation = [
  body('name')
    .notEmpty()
    .withMessage('Cohort name is required')
    .isLength({ max: 100 })
    .withMessage('Cohort name must be at most 100 characters'),
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  body('program')
    .notEmpty()
    .withMessage('Program is required')
    .isLength({ max: 100 })
    .withMessage('Program must be at most 100 characters'),
  body('maxStudents')
    .isInt({ min: 1 })
    .withMessage('Max students must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Update cohort validation
const updateCohortValidation = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Cohort name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Cohort name must be at most 100 characters'),
  body('year')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  body('program')
    .optional()
    .notEmpty()
    .withMessage('Program cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Program must be at most 100 characters'),
  body('maxStudents')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max students must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManager, 
  cohortsController.getAllCohorts
);

router.get('/:id', 
  authenticateToken, 
  authorizeManager, 
  cohortsController.getCohortById
);

router.post('/', 
  authenticateToken, 
  authorizeManager, 
  createCohortValidation, 
  handleValidationErrors, 
  cohortsController.createCohort
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateCohortValidation, 
  handleValidationErrors, 
  cohortsController.updateCohort
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  cohortsController.deleteCohort
);

module.exports = router;