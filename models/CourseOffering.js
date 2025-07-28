const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseOffering:
 *       type: object
 *       required:
 *         - moduleId
 *         - classId
 *         - cohortId
 *         - modeId
 *         - intakePeriod
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         moduleId:
 *           type: integer
 *           description: ID of the module being offered
 *         classId:
 *           type: integer
 *           description: ID of the class
 *         cohortId:
 *           type: integer
 *           description: ID of the cohort
 *         facilitatorId:
 *           type: integer
 *           description: ID of the assigned facilitator
 *         modeId:
 *           type: integer
 *           description: ID of the delivery mode
 *         intakePeriod:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *           description: Intake period (HT1, HT2, FT)
 *         maxStudents:
 *           type: integer
 *           description: Maximum number of students for this offering
 *         currentEnrollment:
 *           type: integer
 *           description: Current number of enrolled students
 *         startDate:
 *           type: string
 *           format: date
 *           description: Course offering start date
 *         endDate:
 *           type: string
 *           format: date
 *           description: Course offering end date
 *         isActive:
 *           type: boolean
 *           description: Whether the course offering is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  cohortId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  facilitatorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'facilitators',
      key: 'id'
    }
  },
  modeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modes',
      key: 'id'
    }
  },
  intakePeriod: {
    type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
    allowNull: false
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  currentEnrollment: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'course_offerings',
  timestamps: true,
  indexes: [
    {
      fields: ['moduleId', 'classId', 'cohortId', 'intakePeriod'],
      unique: true
    },
    {
      fields: ['facilitatorId']
    },
    {
      fields: ['modeId']
    }
  ]
});

module.exports = CourseOffering;