const { Class } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllClasses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, trimester, year, isActive } = req.query;
  
  const allowedFilters = ['trimester', 'year', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: classes } = await Class.findAndCountAll({
    where,
    limit: queryLimit,
    offset,
    order: [['year', 'DESC'], ['trimester', 'ASC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, classes, 'Classes retrieved successfully', 200, meta);
});

const getClassById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const classEntity = await Class.findByPk(id);
  if (!classEntity) {
    return errorResponse(res, 'Class not found', 404);
  }

  return successResponse(res, classEntity, 'Class retrieved successfully');
});

const createClass = asyncHandler(async (req, res) => {
  const { code, trimester, year, startDate, endDate } = req.body;

  // Check if class code already exists
  const existingClass = await Class.findOne({ where: { code } });
  if (existingClass) {
    return errorResponse(res, 'Class code already exists', 409);
  }

  const classEntity = await Class.create({
    code,
    trimester,
    year,
    startDate,
    endDate
  });

  return successResponse(res, classEntity, 'Class created successfully', 201);
});

const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { trimester, year, startDate, endDate, isActive } = req.body;

  const classEntity = await Class.findByPk(id);
  if (!classEntity) {
    return errorResponse(res, 'Class not found', 404);
  }

  await classEntity.update({
    trimester: trimester || classEntity.trimester,
    year: year || classEntity.year,
    startDate: startDate || classEntity.startDate,
    endDate: endDate || classEntity.endDate,
    isActive: isActive !== undefined ? isActive : classEntity.isActive
  });

  return successResponse(res, classEntity, 'Class updated successfully');
});

const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const classEntity = await Class.findByPk(id);
  if (!classEntity) {
    return errorResponse(res, 'Class not found', 404);
  }

  await classEntity.destroy();

  return successResponse(res, null, 'Class deleted successfully');
});

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};