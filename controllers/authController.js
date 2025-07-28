const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Manager, Facilitator } = require('../models');
const { successResponse, errorResponse, validationErrorResponse, asyncHandler } = require('../utils');

const generateToken = (user, role) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user is a manager
  let user = await Manager.findOne({ where: { email, isActive: true } });
  let role = 'manager';

  // If not found as manager, check facilitator
  if (!user) {
    user = await Facilitator.findOne({ where: { email, isActive: true } });
    role = 'facilitator';
  }

  if (!user) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  // Generate token
  const token = generateToken(user, role);

  // Remove password from response
  const userResponse = { ...user.toJSON() };
  delete userResponse.password;

  return successResponse(res, {
    token,
    user: userResponse,
    role
  }, 'Login successful');
});

const registerManager = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if email already exists
  const existingUser = await Manager.findOne({ where: { email } }) || 
                      await Facilitator.findOne({ where: { email } });
  
  if (existingUser) {
    return errorResponse(res, 'Email already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create manager
  const manager = await Manager.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  // Remove password from response
  const managerResponse = { ...manager.toJSON() };
  delete managerResponse.password;

  return successResponse(res, managerResponse, 'Manager registered successfully', 201);
});

const registerFacilitator = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, employeeId, department } = req.body;

  // Check if email or employeeId already exists
  const existingEmail = await Manager.findOne({ where: { email } }) || 
                       await Facilitator.findOne({ where: { email } });
  
  if (existingEmail) {
    return errorResponse(res, 'Email already exists', 409);
  }

  const existingEmployeeId = await Facilitator.findOne({ where: { employeeId } });
  if (existingEmployeeId) {
    return errorResponse(res, 'Employee ID already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create facilitator
  const facilitator = await Facilitator.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    employeeId,
    department
  });

  // Remove password from response
  const facilitatorResponse = { ...facilitator.toJSON() };
  delete facilitatorResponse.password;

  return successResponse(res, facilitatorResponse, 'Facilitator registered successfully', 201);
});

module.exports = {
  login,
  registerManager,
  registerFacilitator
};