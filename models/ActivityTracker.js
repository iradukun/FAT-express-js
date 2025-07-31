const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityTracker:
 *       type: object
 *       required:
 *         - allocationId
 *         - weekNumber
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         allocationId:
 *           type: integer
 *           description: ID of the course offering allocation
 *         weekNumber:
 *           type: integer
 *           description: Week number for the activity tracking
 *           minimum: 1
 *           maximum: 52
 *         attendance:
 *           type: array
 *           items:
 *             type: boolean
 *           description: Array of boolean values representing attendance status
 *         formativeOneGrading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of formative assessment one grading
 *         formativeTwoGrading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of formative assessment two grading
 *         summativeGrading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of summative assessment grading
 *         courseModeration:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of course moderation
 *         intranetSync:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of intranet synchronization
 *         gradeBookStatus:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           description: Status of grade book updates
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           description: When the activity log was submitted
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const ActivityTracker = sequelize.define('ActivityTracker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  allocationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'course_offerings',
      key: 'id'
    }
  },
  weekNumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  attendance: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  formativeOneGrading: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  formativeTwoGrading: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  summativeGrading: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  courseModeration: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  intranetSync: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  gradeBookStatus: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Not Started'
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'activity_trackers',
  timestamps: true,
  indexes: [
    {
      fields: ['allocationId', 'weekNumber'],
      unique: true
    },
    {
      fields: ['allocationId']
    },
    {
      fields: ['weekNumber']
    },
    {
      fields: ['submittedAt']
    }
  ],
  hooks: {
    beforeUpdate: (instance) => {
      // Set submittedAt when any status changes from 'Not Started' or 'Pending' to 'Done'
      const statusFields = ['formativeOneGrading', 'formativeTwoGrading', 'summativeGrading', 'courseModeration', 'intranetSync', 'gradeBookStatus'];
      const hasCompletedTask = statusFields.some(field => 
        instance.changed(field) && instance[field] === 'Done'
      );
      
      if (hasCompletedTask && !instance.submittedAt) {
        instance.submittedAt = new Date();
      }
    },
    beforeCreate: (instance) => {
      // Set submittedAt if any status is 'Done' on creation
      const statusFields = ['formativeOneGrading', 'formativeTwoGrading', 'summativeGrading', 'courseModeration', 'intranetSync', 'gradeBookStatus'];
      const hasCompletedTask = statusFields.some(field => instance[field] === 'Done');
      
      if (hasCompletedTask) {
        instance.submittedAt = new Date();
      }
    }
  }
});

module.exports = ActivityTracker;