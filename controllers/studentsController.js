const { Student, Cohort } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, cohortId, isActive } = req.query;
  
  const allowedFilters = ['cohortId', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: students } = await Student.findAndCountAll({
    where,
    include: [
      {
        model: Cohort,
        as: 'cohort',
        attributes: ['id', 'name', 'program', 'year']
      }
    ],
    limit: queryLimit,
    offset,
    order: [['firstName', 'ASC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, students, 'Students retrieved successfully', 200, meta);
});

const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findByPk(id, {
    include: [
      {
        model: Cohort,
        as: 'cohort',
        attributes: ['id', 'name', 'program', 'year', 'startDate', 'endDate']
      }
    ]
  });

  if (!student) {
    return errorResponse(res, 'Student not found', 404);
  }

  return successResponse(res, student, 'Student retrieved successfully');
});

const createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, studentId, cohortId, enrollmentDate } = req.body;

  // Check if email or studentId already exists
  const existingEmail = await Student.findOne({ where: { email } });
  if (existingEmail) {
    return errorResponse(res, 'Email already exists', 409);
  }

  const existingStudentId = await Student.findOne({ where: { studentId } });
  if (existingStudentId) {
    return errorResponse(res, 'Student ID already exists', 409);
  }

  // Verify cohort exists
  const cohort = await Cohort.findByPk(cohortId);
  if (!cohort) {
    return errorResponse(res, 'Cohort not found', 404);
  }

  const student = await Student.create({
    firstName,
    lastName,
    email,
    studentId,
    cohortId,
    enrollmentDate
  });

  // Include cohort information in response
  const studentWithCohort = await Student.findByPk(student.id, {
    include: [
      {
        model: Cohort,
        as: 'cohort',
        attributes: ['id', 'name', 'program', 'year']
      }
    ]
  });

  return successResponse(res, studentWithCohort, 'Student created successfully', 201);
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, cohortId, enrollmentDate, isActive } = req.body;

  const student = await Student.findByPk(id);
  if (!student) {
    return errorResponse(res, 'Student not found', 404);
  }

  // If cohortId is being updated, verify it exists
  if (cohortId && cohortId !== student.cohortId) {
    const cohort = await Cohort.findByPk(cohortId);
    if (!cohort) {
      return errorResponse(res, 'Cohort not found', 404);
    }
  }

  await student.update({
    firstName: firstName || student.firstName,
    lastName: lastName || student.lastName,
    cohortId: cohortId || student.cohortId,
    enrollmentDate: enrollmentDate || student.enrollmentDate,
    isActive: isActive !== undefined ? isActive : student.isActive
  });

  // Include cohort information in response
  const updatedStudent = await Student.findByPk(id, {
    include: [
      {
        model: Cohort,
        as: 'cohort',
        attributes: ['id', 'name', 'program', 'year']
      }
    ]
  });

  return successResponse(res, updatedStudent, 'Student updated successfully');
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findByPk(id);
  if (!student) {
    return errorResponse(res, 'Student not found', 404);
  }

  await student.destroy();

  return successResponse(res, null, 'Student deleted successfully');
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};