const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Facilitator:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated unique identifier
 *         firstName:
 *           type: string
 *           description: Facilitator's first name
 *         lastName:
 *           type: string
 *           description: Facilitator's last name
 *         email:
 *           type: string
 *           format: email
 *           description: Facilitator's email address
 *         password:
 *           type: string
 *           description: Hashed password
 *         employeeId:
 *           type: string
 *           description: Unique employee identifier
 *         department:
 *           type: string
 *           description: Department the facilitator belongs to
 *         isActive:
 *           type: boolean
 *           description: Whether the facilitator account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const Facilitator = sequelize.define('Facilitator', {
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
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  employeeId: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'facilitators',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['employeeId'],
      where: {
        employeeId: {
          [require('sequelize').Op.ne]: null
        }
      }
    }
  ]
});

module.exports = Facilitator;