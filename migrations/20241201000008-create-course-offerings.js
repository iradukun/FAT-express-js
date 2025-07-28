'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create course_offerings table
    await queryInterface.createTable('course_offerings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cohortId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cohorts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      facilitatorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'facilitators',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      modeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      intakePeriod: {
        type: Sequelize.ENUM('HT1', 'HT2', 'FT'),
        allowNull: false
      },
      maxStudents: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      currentEnrollment: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.addIndex('course_offerings', ['moduleId', 'classId', 'cohortId', 'intakePeriod'], {
      unique: true,
      name: 'course_offerings_unique_combination'
    });

    await queryInterface.addIndex('course_offerings', ['facilitatorId'], {
      name: 'course_offerings_facilitatorId_index'
    });

    await queryInterface.addIndex('course_offerings', ['modeId'], {
      name: 'course_offerings_modeId_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course_offerings');
  }
};