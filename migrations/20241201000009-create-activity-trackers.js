'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create activity_trackers table
    await queryInterface.createTable('activity_trackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      allocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'course_offerings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      weekNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 52
        }
      },
      attendance: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: '[]'
      },
      formativeOneGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      formativeTwoGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      summativeGrading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      courseModeration: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      intranetSync: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      gradeBookStatus: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('activity_trackers', ['allocationId', 'weekNumber'], {
      unique: true,
      name: 'activity_trackers_allocation_week_unique'
    });

    await queryInterface.addIndex('activity_trackers', ['allocationId'], {
      name: 'activity_trackers_allocation_id_index'
    });

    await queryInterface.addIndex('activity_trackers', ['weekNumber'], {
      name: 'activity_trackers_week_number_index'
    });

    await queryInterface.addIndex('activity_trackers', ['submittedAt'], {
      name: 'activity_trackers_submitted_at_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    await queryInterface.removeIndex('activity_trackers', 'activity_trackers_allocation_week_unique');
    await queryInterface.removeIndex('activity_trackers', 'activity_trackers_allocation_id_index');
    await queryInterface.removeIndex('activity_trackers', 'activity_trackers_week_number_index');
    await queryInterface.removeIndex('activity_trackers', 'activity_trackers_submitted_at_index');
    
    // Drop table
    await queryInterface.dropTable('activity_trackers');
  }
};