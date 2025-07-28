const { Cohort, Student } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllCohorts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, year, program, isActive } = req.query;
  
  const allowedFilters = ['year', 'program', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: cohorts } = await Cohort.findAndCountAll({
    where,
    include: [
      {
        model: Student,
        attributes: [],
        required: false
      }
    ],
    attributes: {
      include: [
        [
          require('sequelize').fn('COUNT', require('sequelize').col('Students.id')),
          'studentCount'
        ]
      ]
    },
    group: ['Cohort.id'],
    limit: queryLimit,
    offset,
    order: [['year', 'DESC'], ['name', 'ASC']],
    subQuery: false
  });

  const meta = createPaginationMeta(count.length, page, limit);

  return successResponse(res, cohorts, 'Cohorts retrieved successfully', 200, meta);
});

const getCohortById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cohort = await Cohort.findByPk(id, {
    include: [
      {
        model: Student,
        attributes: ['id', 'firstName', 'lastName', 'email', 'studentId', 'enrollmentDate', 'isActive']
      }
    ]
  });

  if (!cohort) {
    return errorResponse(res, 'Cohort not found', 404);
  }

  return successResponse(res, cohort, 'Cohort retrieved successfully');
});

const createCohort = asyncHandler(async (req, res) => {
  const { name, year, program, startDate, endDate, maxStudents } = req.body;

  const cohort = await Cohort.create({
    name,
    year,
    program,
    startDate,
    endDate,
    maxStudents
  });

  return successResponse(res, cohort, 'Cohort created successfully', 201);
});

const updateCohort = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, year, program, startDate, endDate, maxStudents, isActive } = req.body;

  const cohort = await Cohort.findByPk(id);
  if (!cohort) {
    return errorResponse(res, 'Cohort not found', 404);
  }

  await cohort.update({
    name: name || cohort.name,
    year: year || cohort.year,
    program: program || cohort.program,
    startDate: startDate || cohort.startDate,
    endDate: endDate || cohort.endDate,
    maxStudents: maxStudents || cohort.maxStudents,
    isActive: isActive !== undefined ? isActive : cohort.isActive
  });

  return successResponse(res, cohort, 'Cohort updated successfully');
});

const deleteCohort = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cohort = await Cohort.findByPk(id);
  if (!cohort) {
    return errorResponse(res, 'Cohort not found', 404);
  }

  // Check if cohort has enrolled students
  const studentCount = await Student.count({
    where: { cohortId: id, isActive: true }
  });

  if (studentCount > 0) {
    return errorResponse(res, 'Cannot delete cohort with enrolled students', 400);
  }

  await cohort.destroy();

  return successResponse(res, null, 'Cohort deleted successfully');
});

module.exports = {
  getAllCohorts,
  getCohortById,
  createCohort,
  updateCohort,
  deleteCohort
};