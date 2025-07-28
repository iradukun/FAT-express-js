/**
 * Async wrapper to handle async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Filter object utility - removes undefined/null values
 */
const filterObject = (obj) => {
  return Object.keys(obj).reduce((filtered, key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      filtered[key] = obj[key];
    }
    return filtered;
  }, {});
};

/**
 * Build Sequelize where clause from query parameters
 */
const buildWhereClause = (query, allowedFilters) => {
  const where = {};
  
  allowedFilters.forEach(filter => {
    if (query[filter] !== undefined && query[filter] !== null && query[filter] !== '') {
      where[filter] = query[filter];
    }
  });
  
  return where;
};

module.exports = {
  asyncHandler,
  filterObject,
  buildWhereClause
};