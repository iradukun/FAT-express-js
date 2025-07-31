const { Facilitator, CourseOffering, Module, Class, Cohort, Mode } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, createPaginationMeta, buildWhereClause } = require('../utils');

const getAllFacilitators = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, department, isActive } = req.query;
  
  const allowedFilters = ['department', 'isActive'];
  const where = buildWhereClause(req.query, allowedFilters);

  const { limit: queryLimit, offset } = paginate(page, limit);

  const { count, rows: facilitators } = await Facilitator.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit: queryLimit,
    offset,
    order: [['firstName', 'ASC']]
  });

  const meta = createPaginationMeta(count, page, limit);

  return successResponse(res, facilitators, 'Facilitators retrieved successfully', 200, meta);
});

const getFacilitatorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const facilitator = await Facilitator.findByPk(id, {
    attributes: { exclude: ['password'] }
  });

  if (!facilitator) {
    return errorResponse(res, 'Facilitator not found', 404);
  }

  return successResponse(res, facilitator, 'Facilitator retrieved successfully');
});

const getFacilitatorAssignments = asyncHandler(async (req, res) => {
  const facilitatorId = req.user.id;

  const assignments = await CourseOffering.findAll({
    where: { 
      facilitatorId,
      isActive: true 
    },
    include: [
      { model: Module, as: 'module', attributes: ['id', 'code', 'name', 'credits'] },
      { model: Class, as: 'class', attributes: ['id', 'code', 'trimester', 'year'] },
      { model: Cohort, as: 'cohort', attributes: ['id', 'name', 'program'] },
      { model: Mode, as: 'mode', attributes: ['id', 'name'] }
    ],
    order: [['startDate', 'ASC']]
  });

  return successResponse(res, assignments, 'Facilitator assignments retrieved successfully');
});

const updateFacilitator = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, employeeId, department, isActive } = req.body;

  const facilitator = await Facilitator.findByPk(id);
  if (!facilitator) {
    return errorResponse(res, 'Facilitator not found', 404);
  }

  // Check if employeeId is being updated and already exists
  if (employeeId && employeeId !== facilitator.employeeId) {
    const existingEmployeeId = await Facilitator.findOne({ 
      where: { employeeId },
      attributes: ['id']
    });
    if (existingEmployeeId) {
      return errorResponse(res, 'Employee ID already exists', 409);
    }
  }

  await facilitator.update({
    firstName: firstName || facilitator.firstName,
    lastName: lastName || facilitator.lastName,
    employeeId: employeeId || facilitator.employeeId,
    department: department || facilitator.department,
    isActive: isActive !== undefined ? isActive : facilitator.isActive
  });

  // Remove password from response
  const facilitatorResponse = { ...facilitator.toJSON() };
  delete facilitatorResponse.password;

  return successResponse(res, facilitatorResponse, 'Facilitator updated successfully');
});

const deleteFacilitator = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const facilitator = await Facilitator.findByPk(id);
  if (!facilitator) {
    return errorResponse(res, 'Facilitator not found', 404);
  }

  // Check if facilitator has active course assignments
  const activeAssignments = await CourseOffering.count({
    where: { 
      facilitatorId: id,
      isActive: true 
    }
  });

  if (activeAssignments > 0) {
    return errorResponse(res, 'Cannot delete facilitator with active course assignments', 400);
  }

  await facilitator.destroy();

  return successResponse(res, null, 'Facilitator deleted successfully');
});

module.exports = {
  getAllFacilitators,
  getFacilitatorById,
  getFacilitatorAssignments,
  updateFacilitator,
  deleteFacilitator
};