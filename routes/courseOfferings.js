const express = require('express');
const { body } = require('express-validator');
const { courseOfferingsController } = require('../controllers');
const { authenticateToken, authorizeManager, authorizeManagerOrFacilitator } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Course offering validation
const courseOfferingValidation = [
  body('moduleId')
    .isInt({ min: 1 })
    .withMessage('Module ID must be a positive integer'),
  body('classId')
    .isInt({ min: 1 })
    .withMessage('Class ID must be a positive integer'),
  body('cohortId')
    .isInt({ min: 1 })
    .withMessage('Cohort ID must be a positive integer'),
  body('facilitatorId')
    .isInt({ min: 1 })
    .withMessage('Facilitator ID must be a positive integer'),
  body('modeId')
    .isInt({ min: 1 })
    .withMessage('Mode ID must be a positive integer'),
  body('maxStudents')
    .isInt({ min: 1 })
    .withMessage('Max students must be a positive integer'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('intakePeriod')
    .notEmpty()
    .withMessage('Intake period is required')
];

// Update course offering validation
const updateCourseOfferingValidation = [
  body('facilitatorId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Facilitator ID must be a positive integer'),
  body('maxStudents')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max students must be a positive integer'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Routes
router.get('/', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  courseOfferingsController.getAllCourseOfferings
);

router.get('/:id', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  courseOfferingsController.getCourseOfferingById
);

router.post('/', 
  authenticateToken, 
  authorizeManager, 
  courseOfferingValidation, 
  handleValidationErrors, 
  courseOfferingsController.createCourseOffering
);

router.put('/:id', 
  authenticateToken, 
  authorizeManager, 
  updateCourseOfferingValidation, 
  handleValidationErrors, 
  courseOfferingsController.updateCourseOffering
);

router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  courseOfferingsController.deleteCourseOffering
);

module.exports = router;