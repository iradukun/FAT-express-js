const express = require('express');
const { body } = require('express-validator');
const { studentsController } = require('../controllers');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Create student validation
const createStudentValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be at most 50 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be at most 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ max: 20 })
    .withMessage('Student ID must be at most 20 characters'),
  body('cohortId')
    .isInt({ min: 1 })
    .withMessage('Cohort ID must be a positive integer'),
  body('enrollmentDate')
    .optional()
    .isISO8601()
    .withMessage('Enrollment date must be a valid date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Update student validation
const updateStudentValidation = [
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
  body('studentId')
    .optional()
    .notEmpty()
    .withMessage('Student ID cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Student ID must be at most 20 characters'),
  body('cohortId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cohort ID must be a positive integer'),
  body('enrollmentDate')
    .optional()
    .isISO8601()
    .withMessage('Enrollment date must be a valid date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManager, 
  studentsController.getAllStudents
);

router.get('/:id', 
  authenticateToken, 
  authorizeManager, 
  studentsController.getStudentById
);

router.post('/', 
  authenticateToken, 
  authorizeManager, 
  createStudentValidation, 
  handleValidationErrors, 
  studentsController.createStudent
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateStudentValidation, 
  handleValidationErrors, 
  studentsController.updateStudent
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  studentsController.deleteStudent
);

module.exports = router;