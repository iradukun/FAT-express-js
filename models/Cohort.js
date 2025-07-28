const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cohort:
 *       type: object
 *       required:
 *         - name
 *         - year
 *         - program
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         name:
 *           type: string
 *           description: Cohort name (e.g., "2024 Software Engineering")
 *         year:
 *           type: integer
 *           description: Academic year
 *         program:
 *           type: string
 *           description: Program name
 *         startDate:
 *           type: string
 *           format: date
 *           description: Cohort start date
 *         endDate:
 *           type: string
 *           format: date
 *           description: Cohort end date
 *         maxStudents:
 *           type: integer
 *           description: Maximum number of students in this cohort
 *         isActive:
 *           type: boolean
 *           description: Whether the cohort is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const Cohort = sequelize.define('Cohort', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2050
    }
  },
  program: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
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
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cohorts',
  timestamps: true,
  indexes: [
    {
      fields: ['year', 'program']
    }
  ]
});

module.exports = Cohort;