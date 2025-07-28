'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create modes table
    await queryInterface.createTable('modes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.ENUM('Online', 'In-person', 'Hybrid'),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('modes', ['name'], {
      unique: true,
      name: 'modes_name_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('modes');
  }
};