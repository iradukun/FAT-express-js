const { CourseOffering, Module, Class, Cohort, Facilitator, Mode } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllCourseOfferings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, trimester, cohortId, facilitatorId, modeId, intakePeriod, isActive } = req.query;
  
  const allowedFilters = ['trimester', 'cohortId', 'facilitatorId', 'modeId', 'intakePeriod', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);
  
  // If user is facilitator, only show their assignments
  if (req.user.role === 'facilitator') {
    where.facilitatorId = req.user.id;
  }

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: courseOfferings } = await CourseOffering.findAndCountAll({
    where,
    include: [
      { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'credits'] },
      { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
      { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
      { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'] },
      { model: Mode, as: 'mode', attributes: ['id', 'name'] }
    ],
    limit: queryLimit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, courseOfferings, 'Course offerings retrieved successfully', 200, meta);
});

const getCourseOfferingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const where = { id };
  
  // If user is facilitator, only show their assignments
  if (req.user.role === 'facilitator') {
    where.facilitatorId = req.user.id;
  }

  const courseOffering = await CourseOffering.findOne({
    where,
    include: [
      { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'description', 'credits', 'level'] },
      { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year', 'startDate', 'endDate'] },
      { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program', 'year'] },
      { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId', 'department'] },
      { model: Mode, as: 'mode', attributes: ['id', 'name', 'description'] }
    ]
  });

  if (!courseOffering) {
    return errorResponse(res, 'Course offering not found', 404);
  }

  return successResponse(res, courseOffering, 'Course offering retrieved successfully');
});

const createCourseOffering = asyncHandler(async (req, res) => {
  const { moduleId, classId, cohortId, facilitatorId, modeId, intakePeriod, maxStudents, startDate, endDate } = req.body;

  // Check if course offering already exists
  const existingOffering = await CourseOffering.findOne({
    where: { moduleId, classId, cohortId, intakePeriod }
  });

  if (existingOffering) {
    return errorResponse(res, 'Course offering already exists for this module, class, cohort, and intake period', 409);
  }

  // Verify foreign key references exist
  const [module, classEntity, cohort, facilitator, mode] = await Promise.all([
    Module.findByPk(moduleId),
    Class.findByPk(classId),
    Cohort.findByPk(cohortId),
    Facilitator.findByPk(facilitatorId),
    Mode.findByPk(modeId)
  ]);

  if (!module) return errorResponse(res, 'Module not found', 404);
  if (!classEntity) return errorResponse(res, 'Class not found', 404);
  if (!cohort) return errorResponse(res, 'Cohort not found', 404);
  if (!facilitator) return errorResponse(res, 'Facilitator not found', 404);
  if (!mode) return errorResponse(res, 'Mode not found', 404);

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
});

const updateCourseOffering = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { facilitatorId, maxStudents, startDate, endDate, isActive } = req.body;

  const courseOffering = await CourseOffering.findByPk(id);
  if (!courseOffering) {
    return errorResponse(res, 'Course offering not found', 404);
  }

  // If facilitatorId is being updated, verify it exists
  if (facilitatorId) {
    const facilitator = await Facilitator.findByPk(facilitatorId);
    if (!facilitator) {
      return errorResponse(res, 'Facilitator not found', 404);
    }
  }

  await courseOffering.update({
    facilitatorId: facilitatorId || courseOffering.facilitatorId,
    maxStudents: maxStudents || courseOffering.maxStudents,
    startDate: startDate || courseOffering.startDate,
    endDate: endDate || courseOffering.endDate,
    isActive: isActive !== undefined ? isActive : courseOffering.isActive
  });

  return successResponse(res, courseOffering, 'Course offering updated successfully');
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