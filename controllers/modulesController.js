const { Module } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllModules = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, level, isActive } = req.query;
  
  const allowedFilters = ['level', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: modules } = await Module.findAndCountAll({
    where,
    limit: queryLimit,
    offset,
    order: [['code', 'ASC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, modules, 'Modules retrieved successfully', 200, meta);
});

const getModuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const module = await Module.findByPk(id);
  if (!module) {
    return errorResponse(res, 'Module not found', 404);
  }

  return successResponse(res, module, 'Module retrieved successfully');
});

const createModule = asyncHandler(async (req, res) => {
  const { code, name, description, credits, level } = req.body;

  // Check if module code already exists
  const existingModule = await Module.findOne({ where: { code } });
  if (existingModule) {
    return errorResponse(res, 'Module code already exists', 409);
  }

  const module = await Module.create({
    code,
    name,
    description,
    credits,
    level
  });

  return successResponse(res, module, 'Module created successfully', 201);
});

const updateModule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, credits, level, isActive } = req.body;

  const module = await Module.findByPk(id);
  if (!module) {
    return errorResponse(res, 'Module not found', 404);
  }

  await module.update({
    name: name || module.name,
    description: description || module.description,
    credits: credits || module.credits,
    level: level || module.level,
    isActive: isActive !== undefined ? isActive : module.isActive
  });

  return successResponse(res, module, 'Module updated successfully');
});

const deleteModule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const module = await Module.findByPk(id);
  if (!module) {
    return errorResponse(res, 'Module not found', 404);
  }

  await module.destroy();

  return successResponse(res, null, 'Module deleted successfully');
});

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule
};