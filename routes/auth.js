const express = require('express');
const { body } = require('express-validator');
const { authController } = require('../controllers');
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Manager registration validation
const managerRegistrationValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Facilitator registration validation
const facilitatorRegistrationValidation = [
  ...managerRegistrationValidation,
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
];

// Routes
router.post('/login', loginValidation, handleValidationErrors, authController.login);

router.post('/register/manager', 
  authenticateToken, 
  authorizeManager, 
  managerRegistrationValidation, 
  handleValidationErrors, 
  authController.registerManager
);

router.post('/register/facilitator', 
  authenticateToken, 
  authorizeManager, 
  facilitatorRegistrationValidation, 
  handleValidationErrors, 
  authController.registerFacilitator
);

module.exports = router;