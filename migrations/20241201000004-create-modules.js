'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create modules table
    await queryInterface.createTable('modules', {
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
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      level: {
        type: Sequelize.ENUM('undergraduate', 'postgraduate', 'diploma'),
        allowNull: false,
        defaultValue: 'undergraduate'
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
    await queryInterface.addIndex('modules', ['code'], {
      unique: true,
      name: 'modules_code_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('modules');
  }
};