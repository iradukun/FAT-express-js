const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    return validationErrorResponse(res, formattedErrors);
  }
  next();
};

module.exports = {
  handleValidationErrors
};