const express = require('express');
const { body } = require('express-validator');
const { modulesController } = require('../controllers');
const { authenticateToken, authorizeManager, authorizeManagerOrFacilitator } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Module validation
const moduleValidation = [
  body('moduleCode')
    .notEmpty()
    .withMessage('Module code is required')
    .isLength({ max: 10 })
    .withMessage('Module code must be at most 10 characters'),
  body('moduleName')
    .notEmpty()
    .withMessage('Module name is required')
    .isLength({ max: 100 })
    .withMessage('Module name must be at most 100 characters'),
  body('credits')
    .isInt({ min: 1, max: 10 })
    .withMessage('Credits must be between 1 and 10'),
  body('level')
    .isIn(['Foundation', 'Diploma', 'Degree'])
    .withMessage('Level must be Foundation, Diploma, or Degree'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters')
];

// Update module validation
const updateModuleValidation = [
  body('moduleCode')
    .optional()
    .notEmpty()
    .withMessage('Module code cannot be empty')
    .isLength({ max: 10 })
    .withMessage('Module code must be at most 10 characters'),
  body('moduleName')
    .optional()
    .notEmpty()
    .withMessage('Module name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Module name must be at most 100 characters'),
  body('credits')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Credits must be between 1 and 10'),
  body('level')
    .optional()
    .isIn(['Foundation', 'Diploma', 'Degree'])
    .withMessage('Level must be Foundation, Diploma, or Degree'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  modulesController.getAllModules
);

router.get('/:id', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  modulesController.getModuleById
);

router.post('/', 
  authenticateToken, 
  authorizeManager, 
  moduleValidation, 
  handleValidationErrors, 
  modulesController.createModule
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateModuleValidation, 
  handleValidationErrors, 
  modulesController.updateModule
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  modulesController.deleteModule
);

module.exports = router;