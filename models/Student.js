const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - studentId
 *         - cohortId
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         firstName:
 *           type: string
 *           description: Student's first name
 *         lastName:
 *           type: string
 *           description: Student's last name
 *         email:
 *           type: string
 *           format: email
 *           description: Student's email address
 *         studentId:
 *           type: string
 *           description: Unique student identifier
 *         cohortId:
 *           type: integer
 *           description: ID of the cohort the student belongs to
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           description: Date of enrollment
 *         isActive:
 *           type: boolean
 *           description: Whether the student is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  studentId: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  cohortId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['studentId']
    },
    {
      fields: ['cohortId']
    }
  ]
});

module.exports = Student;