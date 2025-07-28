const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - credits
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         code:
 *           type: string
 *           description: Unique module code (e.g., CS101)
 *         name:
 *           type: string
 *           description: Module name
 *         description:
 *           type: string
 *           description: Module description
 *         credits:
 *           type: integer
 *           description: Number of credits for this module
 *         level:
 *           type: string
 *           enum: [undergraduate, postgraduate, diploma]
 *           description: Academic level of the module
 *         isActive:
 *           type: boolean
 *           description: Whether the module is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const Module = sequelize.define('Module', {
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
      len: [3, 20]
    }
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 20
    }
  },
  level: {
    type: DataTypes.ENUM('undergraduate', 'postgraduate', 'diploma'),
    allowNull: false,
    defaultValue: 'undergraduate'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'modules',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    }
  ]
});

module.exports = Module;