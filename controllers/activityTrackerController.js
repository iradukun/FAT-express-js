const { ActivityTracker, CourseOffering, Module, Class, Cohort, Facilitator, Mode } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, allocationId, weekNumber, facilitatorId, status } = req.query;
  
  const allowedFilters = ['allocationId', 'weekNumber'];
  const where = buildWhereClause(req.query, allowedFilters);
  
  try {
    // Build include array for CourseOffering with nested associations
    const include = [
      {
        model: CourseOffering,
        as: 'allocation',
        required: false,
        include: [
          { model: Module, as: 'module', attributes: ['id', 'code', 'name'], required: false },
          { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'], required: false },
          { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'], required: false },
          { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'], required: false },
          { model: Mode, as: 'mode', attributes: ['id', 'name'], required: false }
        ]
      }
    ];

    // If user is facilitator, only show their logs
    if (req.user && req.user.role === 'facilitator') {
      include[0].where = { facilitatorId: req.user.id };
    } else if (facilitatorId) {
      // If manager requests specific facilitator's logs
      include[0].where = { facilitatorId };
    }

    const { rows: activityLogs, count } = await ActivityTracker.findAndCountAll({
      where,
      include,
      ...paginate(page, limit),
      order: [['weekNumber', 'ASC'], ['createdAt', 'DESC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, activityLogs, 'Activity logs retrieved successfully', 200, meta);
  } catch (error) {
    // Fallback: get activity logs without includes if associations fail
    const { rows: activityLogs, count } = await ActivityTracker.findAndCountAll({
      where,
      ...paginate(page, limit),
      order: [['weekNumber', 'ASC'], ['createdAt', 'DESC']]
    });

    const meta = createPaginationMeta(count, page, limit);
    return successResponse(res, activityLogs, 'Activity logs retrieved successfully', 200, meta);
  }
});

const getActivityLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const include = [
    {
      model: CourseOffering,
      as: 'allocation',
      include: [
        { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'description'] },
        { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
        { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
        { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'] },
        { model: Mode, as: 'mode', attributes: ['id', 'name'] }
      ]
    }
  ];

  // If user is facilitator, only show their logs
  if (req.user.role === 'facilitator') {
    include[0].where = { facilitatorId: req.user.id };
  }

  const activityLog = await ActivityTracker.findOne({
    where: { id },
    include
  });

  if (!activityLog) {
    return errorResponse(res, 'Activity log not found', 404);
  }

  return successResponse(res, activityLog, 'Activity log retrieved successfully');
});

const createActivityLog = asyncHandler(async (req, res) => {
  const { allocationId, weekNumber, attendance, formativeOneGrading, formativeTwoGrading, summativeGrading, courseModeration, intranetSync, gradeBookStatus } = req.body;

  try {
    const activityLog = await ActivityTracker.create({
      allocationId,
      weekNumber,
      attendance: attendance || [],
      formativeOneGrading: formativeOneGrading || 'Not Started',
      formativeTwoGrading: formativeTwoGrading || 'Not Started',
      summativeGrading: summativeGrading || 'Not Started',
      courseModeration: courseModeration || 'Not Started',
      intranetSync: intranetSync || 'Not Started',
      gradeBookStatus: gradeBookStatus || 'Not Started'
    });

    return successResponse(res, activityLog, 'Activity log created successfully', 201);
  } catch (error) {
    return errorResponse(res, `Failed to create activity log: ${error.message}`, 400);
  }
});

const updateActivityLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { attendance, formativeOneGrading, formativeTwoGrading, summativeGrading, courseModeration, intranetSync, gradeBookStatus } = req.body;

  const activityLog = await ActivityTracker.findByPk(id, {
    include: [
      {
        model: CourseOffering,
        as: 'allocation'
      }
    ]
  });

  if (!activityLog) {
    return errorResponse(res, 'Activity log not found', 404);
  }

  // If user is facilitator, ensure they can only update their own logs
  if (req.user.role === 'facilitator' && activityLog.allocation.facilitatorId !== req.user.id) {
    return errorResponse(res, 'You can only update your own activity logs', 403);
  }

  await activityLog.update({
    attendance: attendance !== undefined ? attendance : activityLog.attendance,
    formativeOneGrading: formativeOneGrading || activityLog.formativeOneGrading,
    formativeTwoGrading: formativeTwoGrading || activityLog.formativeTwoGrading,
    summativeGrading: summativeGrading || activityLog.summativeGrading,
    courseModeration: courseModeration || activityLog.courseModeration,
    intranetSync: intranetSync || activityLog.intranetSync,
    gradeBookStatus: gradeBookStatus || activityLog.gradeBookStatus
  });

  // Fetch updated log with associations
  const updatedLog = await ActivityTracker.findByPk(id, {
    include: [
      {
        model: CourseOffering,
        as: 'allocation',
        include: [
          { model: Module, as: 'module', attributes: ['id', 'code', 'name'] },
          { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
          { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
          { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'] },
          { model: Mode, as: 'mode', attributes: ['id', 'name'] }
        ]
      }
    ]
  });

  return successResponse(res, updatedLog, 'Activity log updated successfully');
});

const deleteActivityLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const activityLog = await ActivityTracker.findByPk(id, {
    include: [
      {
        model: CourseOffering,
        as: 'allocation'
      }
    ]
  });

  if (!activityLog) {
    return errorResponse(res, 'Activity log not found', 404);
  }

  // If user is facilitator, ensure they can only delete their own logs
  if (req.user.role === 'facilitator' && activityLog.allocation.facilitatorId !== req.user.id) {
    return errorResponse(res, 'You can only delete your own activity logs', 403);
  }

  await activityLog.destroy();

  return successResponse(res, null, 'Activity log deleted successfully');
});

const getActivityLogsByFacilitator = asyncHandler(async (req, res) => {
  const { facilitatorId } = req.params;
  const { page = 1, limit = 10, weekNumber, status } = req.query;

  // Only managers can view other facilitators' logs
  if (req.user.role === 'facilitator' && req.user.id !== parseInt(facilitatorId)) {
    return errorResponse(res, 'You can only view your own activity logs', 403);
  }

  const where = {};
  if (weekNumber) where.weekNumber = weekNumber;
  if (status) {
    const statusFields = ['formativeOneGrading', 'formativeTwoGrading', 'summativeGrading', 'courseModeration', 'intranetSync', 'gradeBookStatus'];
    where[statusFields] = statusFields.map(field => ({ [field]: status }));
  }

  const { rows: activityLogs, count } = await ActivityTracker.findAndCountAll({
    where,
    include: [
      {
        model: CourseOffering,
        as: 'allocation',
        where: { facilitatorId },
        include: [
          { model: Module, as: 'module', attributes: ['id', 'code', 'name'] },
          { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
          { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
          { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'] },
          { model: Mode, as: 'mode', attributes: ['id', 'name'] }
        ]
      }
    ],
    ...paginate(page, limit),
    order: [['weekNumber', 'ASC'], ['createdAt', 'DESC']]
  });

  const meta = createPaginationMeta(count, page, limit);
  return successResponse(res, activityLogs, 'Activity logs retrieved successfully', 200, meta);
});

const getActivityLogsByCourse = asyncHandler(async (req, res) => {
  const { allocationId } = req.params;
  const { page = 1, limit = 10, weekNumber, status } = req.query;

  // Verify course offering exists
  const courseOffering = await CourseOffering.findByPk(allocationId);
  if (!courseOffering) {
    return errorResponse(res, 'Course offering not found', 404);
  }

  // If user is facilitator, ensure they can only view their own course logs
  if (req.user.role === 'facilitator' && courseOffering.facilitatorId !== req.user.id) {
    return errorResponse(res, 'You can only view activity logs for your assigned courses', 403);
  }

  const where = { allocationId };
  if (weekNumber) where.weekNumber = weekNumber;
  if (status) {
    const statusFields = ['formativeOneGrading', 'formativeTwoGrading', 'summativeGrading', 'courseModeration', 'intranetSync', 'gradeBookStatus'];
    where[statusFields] = statusFields.map(field => ({ [field]: status }));
  }

  const { rows: activityLogs, count } = await ActivityTracker.findAndCountAll({
    where,
    include: [
      {
        model: CourseOffering,
        as: 'allocation',
        include: [
          { model: Module, as: 'module', attributes: ['id', 'code', 'name'] },
          { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
          { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
          { model: Facilitator, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'employeeId'] },
          { model: Mode, as: 'mode', attributes: ['id', 'name'] }
        ]
      }
    ],
    ...paginate(page, limit),
    order: [['weekNumber', 'ASC'], ['createdAt', 'DESC']]
  });

  const meta = createPaginationMeta(count, page, limit);
  return successResponse(res, activityLogs, 'Activity logs retrieved successfully', 200, meta);
});

module.exports = {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
  getActivityLogsByFacilitator,
  getActivityLogsByCourse
};