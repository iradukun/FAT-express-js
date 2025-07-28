'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create facilitators table
    await queryInterface.createTable('facilitators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      employeeId: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('facilitators', ['email'], {
      unique: true,
      name: 'facilitators_email_unique'
    });

    await queryInterface.addIndex('facilitators', ['employeeId'], {
      unique: true,
      name: 'facilitators_employeeId_unique',
      where: {
        employeeId: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('facilitators');
  }
};