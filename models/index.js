const sequelize = require('../config/database');

// Import all models
const Manager = require('./Manager');
const Facilitator = require('./Facilitator');
const Module = require('./Module');
const Cohort = require('./Cohort');
const Class = require('./Class');
const Student = require('./Student');
const Mode = require('./Mode');
const CourseOffering = require('./CourseOffering');

// Define associations

// Student belongs to Cohort
Student.belongsTo(Cohort, {
  foreignKey: 'cohortId',
  as: 'cohort'
});
Cohort.hasMany(Student, {
  foreignKey: 'cohortId',
  as: 'students'
});

// CourseOffering associations
CourseOffering.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});
Module.hasMany(CourseOffering, {
  foreignKey: 'moduleId',
  as: 'offerings'
});

CourseOffering.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});
Class.hasMany(CourseOffering, {
  foreignKey: 'classId',
  as: 'offerings'
});

CourseOffering.belongsTo(Cohort, {
  foreignKey: 'cohortId',
  as: 'cohort'
});
Cohort.hasMany(CourseOffering, {
  foreignKey: 'cohortId',
  as: 'offerings'
});

CourseOffering.belongsTo(Facilitator, {
  foreignKey: 'facilitatorId',
  as: 'facilitator'
});
Facilitator.hasMany(CourseOffering, {
  foreignKey: 'facilitatorId',
  as: 'assignments'
});

CourseOffering.belongsTo(Mode, {
  foreignKey: 'modeId',
  as: 'mode'
});
Mode.hasMany(CourseOffering, {
  foreignKey: 'modeId',
  as: 'offerings'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  Manager,
  Facilitator,
  Module,
  Cohort,
  Class,
  Student,
  Mode,
  CourseOffering
};