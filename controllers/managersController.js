const { Manager } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllManagers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive } = req.query;
  
  const allowedFilters = ['isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: managers } = await Manager.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit: queryLimit,
    offset,
    order: [['firstName', 'ASC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, managers, 'Managers retrieved successfully', 200, meta);
});

const getManagerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const manager = await Manager.findByPk(id, {
    attributes: { exclude: ['password'] }
  });

  if (!manager) {
    return errorResponse(res, 'Manager not found', 404);
  }

  return successResponse(res, manager, 'Manager retrieved successfully');
});

const updateManager = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, isActive } = req.body;

  const manager = await Manager.findByPk(id);
  if (!manager) {
    return errorResponse(res, 'Manager not found', 404);
  }

  await manager.update({
    firstName: firstName || manager.firstName,
    lastName: lastName || manager.lastName,
    isActive: isActive !== undefined ? isActive : manager.isActive
  });

  // Remove password from response
  const managerResponse = { ...manager.toJSON() };
  delete managerResponse.password;

  return successResponse(res, managerResponse, 'Manager updated successfully');
});

const deleteManager = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent managers from deleting their own account
  if (req.user.id === parseInt(id)) {
    return errorResponse(res, 'Cannot delete your own account', 400);
  }

  const manager = await Manager.findByPk(id);
  if (!manager) {
    return errorResponse(res, 'Manager not found', 404);
  }

  await manager.destroy();

  return successResponse(res, null, 'Manager deleted successfully');
});

module.exports = {
  getAllManagers,
  getManagerById,
  updateManager,
  deleteManager
};