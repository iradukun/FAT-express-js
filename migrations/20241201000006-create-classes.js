'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create classes table
    await queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      trimester: {
        type: Sequelize.ENUM('T1', 'T2', 'T3', 'Summer'),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.addIndex('classes', ['code'], {
      unique: true,
      name: 'classes_code_unique'
    });

    await queryInterface.addIndex('classes', ['year', 'trimester'], {
      name: 'classes_year_trimester_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};