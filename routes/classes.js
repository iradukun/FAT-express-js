const express = require('express');
const { body } = require('express-validator');
const { classesController } = require('../controllers');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Create class validation
const createClassValidation = [
  body('code')
    .notEmpty()
    .withMessage('Class code is required')
    .isLength({ max: 20 })
    .withMessage('Class code must be at most 20 characters'),
  body('name')
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ max: 100 })
    .withMessage('Class name must be at most 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Update class validation
const updateClassValidation = [
  body('code')
    .optional()
    .notEmpty()
    .withMessage('Class code cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Class code must be at most 20 characters'),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Class name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Class name must be at most 100 characters'),
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
  authorizeManager, 
  classesController.getAllClasses
);

router.get('/:id', 
  authenticateToken, 
  authorizeManager, 
  classesController.getClassById
);

router.post('/', 
  authenticateToken, 
  authorizeManager, 
  createClassValidation, 
  handleValidationErrors, 
  classesController.createClass
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateClassValidation, 
  handleValidationErrors, 
  classesController.updateClass
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  classesController.deleteClass
);

module.exports = router;