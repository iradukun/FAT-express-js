/**
 * Pagination utility for API responses
 */
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset)
  };
};

/**
 * Create pagination metadata for responses
 */
const createPaginationMeta = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: count,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  paginate,
  createPaginationMeta
};