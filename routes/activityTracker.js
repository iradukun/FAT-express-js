const express = require('express');
const { body, param, query } = require('express-validator');
const { activityTrackerController } = require('../controllers');
const { authenticateToken, authorizeManager, authorizeManagerOrFacilitator } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createActivityLogValidation = [
  body('allocationId')
    .isInt({ min: 1 })
    .withMessage('Allocation ID must be a positive integer'),
  body('weekNumber')
    .isInt({ min: 1, max: 52 })
    .withMessage('Week number must be between 1 and 52'),
  body('attendance')
    .optional()
    .isArray()
    .withMessage('Attendance must be an array')
    .custom((value) => {
      if (value && value.some(item => typeof item !== 'boolean')) {
        throw new Error('All attendance values must be boolean');
      }
      return true;
    }),
  body('formativeOneGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Formative one grading must be Done, Pending, or Not Started'),
  body('formativeTwoGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Formative two grading must be Done, Pending, or Not Started'),
  body('summativeGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Summative grading must be Done, Pending, or Not Started'),
  body('courseModeration')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Course moderation must be Done, Pending, or Not Started'),
  body('intranetSync')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Intranet sync must be Done, Pending, or Not Started'),
  body('gradeBookStatus')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Grade book status must be Done, Pending, or Not Started')
];

const updateActivityLogValidation = [
  body('attendance')
    .optional()
    .isArray()
    .withMessage('Attendance must be an array')
    .custom((value) => {
      if (value && value.some(item => typeof item !== 'boolean')) {
        throw new Error('All attendance values must be boolean');
      }
      return true;
    }),
  body('formativeOneGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Formative one grading must be Done, Pending, or Not Started'),
  body('formativeTwoGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Formative two grading must be Done, Pending, or Not Started'),
  body('summativeGrading')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Summative grading must be Done, Pending, or Not Started'),
  body('courseModeration')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Course moderation must be Done, Pending, or Not Started'),
  body('intranetSync')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Intranet sync must be Done, Pending, or Not Started'),
  body('gradeBookStatus')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Grade book status must be Done, Pending, or Not Started')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

const facilitatorIdValidation = [
  param('facilitatorId')
    .isInt({ min: 1 })
    .withMessage('Facilitator ID must be a positive integer')
];

const allocationIdValidation = [
  param('allocationId')
    .isInt({ min: 1 })
    .withMessage('Allocation ID must be a positive integer')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('weekNumber')
    .optional()
    .isInt({ min: 1, max: 52 })
    .withMessage('Week number must be between 1 and 52'),
  query('allocationId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Allocation ID must be a positive integer'),
  query('facilitatorId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Facilitator ID must be a positive integer'),
  query('status')
    .optional()
    .isIn(['Done', 'Pending', 'Not Started'])
    .withMessage('Status must be Done, Pending, or Not Started')
];

// Routes

// GET /api/activity-logs - Get all activity logs with filtering
router.get('/', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  queryValidation,
  handleValidationErrors,
  activityTrackerController.getAllActivityLogs
);

// GET /api/activity-logs/facilitator/:facilitatorId - Get activity logs by facilitator
router.get('/facilitator/:facilitatorId', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  facilitatorIdValidation.concat(queryValidation),
  handleValidationErrors,
  activityTrackerController.getActivityLogsByFacilitator
);

// GET /api/activity-logs/course/:allocationId - Get activity logs by course allocation
router.get('/course/:allocationId', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  allocationIdValidation.concat(queryValidation),
  handleValidationErrors,
  activityTrackerController.getActivityLogsByCourse
);

// GET /api/activity-logs/:id - Get activity log by ID
router.get('/:id', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  idValidation,
  handleValidationErrors,
  activityTrackerController.getActivityLogById
);

// POST /api/activity-logs - Create new activity log
router.post('/', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  createActivityLogValidation,
  handleValidationErrors,
  activityTrackerController.createActivityLog
);

// PUT /api/activity-logs/:id - Update activity log
router.put('/:id', 
  authenticateToken, 
  authorizeManagerOrFacilitator, 
  idValidation.concat(updateActivityLogValidation),
  handleValidationErrors,
  activityTrackerController.updateActivityLog
);

// DELETE /api/activity-logs/:id - Delete activity log
router.delete('/:id', 
  authenticateToken, 
  authorizeManager, 
  idValidation,
  handleValidationErrors,
  activityTrackerController.deleteActivityLog
);

module.exports = router;