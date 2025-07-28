const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - code
 *         - trimester
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         code:
 *           type: string
 *           description: Class code (e.g., "2024S", "2025J")
 *         trimester:
 *           type: string
 *           enum: [T1, T2, T3, Summer]
 *           description: Trimester designation
 *         year:
 *           type: integer
 *           description: Academic year
 *         startDate:
 *           type: string
 *           format: date
 *           description: Class start date
 *         endDate:
 *           type: string
 *           format: date
 *           description: Class end date
 *         isActive:
 *           type: boolean
 *           description: Whether the class is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [4, 20]
    }
  },
  trimester: {
    type: DataTypes.ENUM('T1', 'T2', 'T3', 'Summer'),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2050
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
  tableName: 'classes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['year', 'trimester']
    }
  ]
});

module.exports = Class;