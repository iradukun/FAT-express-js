const { Student, Cohort } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, cohortId, isActive } = req.query;
  
  const allowedFilters = ['cohortId', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  try {
    const { count, rows: students } = await Student.findAndCountAll({
      where,
      include: [
        {
          model: Cohort,
          as: 'cohort',
          attributes: ['id', 'name', 'program', 'year'],
          required: false
        }
      ],
      limit: queryLimit,
      offset,
      order: [['firstName', 'ASC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, students, 'Students retrieved successfully', 200, meta);
  } catch (error) {
    // If include fails, get students without cohort data
    const { count, rows: students } = await Student.findAndCountAll({
      where,
      limit: queryLimit,
      offset,
      order: [['firstName', 'ASC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, students, 'Students retrieved successfully', 200, meta);
  }
});

const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Cohort,
          as: 'cohort',
          attributes: ['id', 'name', 'program', 'year', 'startDate', 'endDate'],
          required: false
        }
      ]
    });

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    return successResponse(res, student, 'Student retrieved successfully');
  } catch (error) {
    // If include fails, get student without cohort data
    const student = await Student.findByPk(id);

    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }

    return successResponse(res, student, 'Student retrieved successfully');
  }
});

const createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, studentId, cohortId, enrollmentDate } = req.body;

  const student = await Student.create({
    firstName,
    lastName,
    email,
    studentId,
    cohortId,
    enrollmentDate
  });

  // Include cohort information in response if cohortId exists
  let studentWithCohort = student;
  if (cohortId) {
    try {
      studentWithCohort = await Student.findByPk(student.id, {
        include: [
          {
            model: Cohort,
            as: 'cohort',
            attributes: ['id', 'name', 'program', 'year']
          }
        ]
      });
    } catch (error) {
      // If include fails, just return the student without cohort
      studentWithCohort = student;
    }
  }

  return successResponse(res, studentWithCohort, 'Student created successfully', 201);
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, cohortId, enrollmentDate, isActive } = req.body;

  const student = await Student.findByPk(id);
  if (!student) {
    return errorResponse(res, 'Student not found', 404);
  }

  await student.update({
    firstName: firstName || student.firstName,
    lastName: lastName || student.lastName,
    cohortId: cohortId || student.cohortId,
    enrollmentDate: enrollmentDate || student.enrollmentDate,
    isActive: isActive !== undefined ? isActive : student.isActive
  });

  // Include cohort information in response if cohortId exists
  let updatedStudent = student;
  if (student.cohortId) {
    try {
      updatedStudent = await Student.findByPk(id, {
        include: [
          {
            model: Cohort,
            as: 'cohort',
            attributes: ['id', 'name', 'program', 'year']
          }
        ]
      });
    } catch (error) {
      // If include fails, just return the student without cohort
      updatedStudent = student;
    }
  }

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