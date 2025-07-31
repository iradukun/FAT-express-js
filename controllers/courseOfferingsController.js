const { CourseOffering, Module, Class, Cohort, Facilitator, Mode } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllCourseOfferings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, trimester, cohortId, facilitatorId, modeId, intakePeriod, isActive } = req.query;
  
  const allowedFilters = ['trimester', 'cohortId', 'facilitatorId', 'modeId', 'intakePeriod', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);
  
  // If user is facilitator, only show their assignments
  if (req.user && req.user.role === 'facilitator') {
    where.facilitatorId = req.user.id;
  }

  const { limit: queryLimit, offset } = paginate(page, limit);

  try {
    const { count, rows: courseOfferings } = await CourseOffering.findAndCountAll({
      where,
      include: [
        { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'credits'], required: false },
        { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'], required: false },
        { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'], required: false },
        { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'], required: false },
        { model: Mode, as: 'mode', attributes: ['id', 'name'], required: false }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, courseOfferings, 'Course offerings retrieved successfully', 200, meta);
  } catch (error) {
    // Fallback: get course offerings without includes if associations fail
    const { count, rows: courseOfferings } = await CourseOffering.findAndCountAll({
      where,
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, courseOfferings, 'Course offerings retrieved successfully', 200, meta);
  }
});

const getCourseOfferingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const where = { id };
  
  // If user is facilitator, only show their assignments
  if (req.user && req.user.role === 'facilitator') {
    where.facilitatorId = req.user.id;
  }

  try {
    const courseOffering = await CourseOffering.findOne({
      where,
      include: [
        { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'description', 'credits', 'level'], required: false },
        { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year', 'startDate', 'endDate'], required: false },
        { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program', 'year'], required: false },
        { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId', 'department'], required: false },
        { model: Mode, as: 'mode', attributes: ['id', 'name', 'description'], required: false }
      ]
    });

    if (!courseOffering) {
      return errorResponse(res, 'Course offering not found', 404);
    }

    return successResponse(res, courseOffering, 'Course offering retrieved successfully');
  } catch (error) {
    // Fallback: get course offering without includes if associations fail
    const courseOffering = await CourseOffering.findOne({ where });

    if (!courseOffering) {
      return errorResponse(res, 'Course offering not found', 404);
    }

    return successResponse(res, courseOffering, 'Course offering retrieved successfully');
  }
});

const createCourseOffering = asyncHandler(async (req, res) => {
  const { moduleId, classId, cohortId, facilitatorId, modeId, intakePeriod, maxStudents, startDate, endDate } = req.body;

  try {
    const courseOffering = await CourseOffering.create({
      moduleId,
      classId,
      cohortId,
      facilitatorId,
      modeId,
      intakePeriod,
      maxStudents,
      startDate,
      endDate
    });

    return successResponse(res, courseOffering, 'Course offering created successfully', 201);
  } catch (error) {
    return errorResponse(res, `Failed to create course offering: ${error.message}`, 400);
  }
});

const updateCourseOffering = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const courseOffering = await CourseOffering.findByPk(id);
    if (!courseOffering) {
      return errorResponse(res, 'Course offering not found', 404);
    }

    await courseOffering.update(updateData);

    return successResponse(res, courseOffering, 'Course offering updated successfully');
  } catch (error) {
    return errorResponse(res, `Failed to update course offering: ${error.message}`, 400);
  }
});

const deleteCourseOffering = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const courseOffering = await CourseOffering.findByPk(id);
  if (!courseOffering) {
    return errorResponse(res, 'Course offering not found', 404);
  }

  await courseOffering.destroy();

  return successResponse(res, null, 'Course offering deleted successfully');
});

module.exports = {
  getAllCourseOfferings,
  getCourseOfferingById,
  createCourseOffering,
  updateCourseOffering,
  deleteCourseOffering
};