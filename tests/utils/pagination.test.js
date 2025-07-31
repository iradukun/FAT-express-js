const { paginate, createPaginationMeta } = require('../../utils/pagination');

describe('Utility Functions - pagination.js', () => {
  describe('paginate', () => {
    test('should calculate correct limit and offset for first page', () => {
      const result = paginate(1, 10);

      expect(result).toEqual({
        limit: 10,
        offset: 0
      });
    });

    test('should calculate correct limit and offset for second page', () => {
      const result = paginate(2, 10);

      expect(result).toEqual({
        limit: 10,
        offset: 10
      });
    });

    test('should calculate correct limit and offset for third page', () => {
      const result = paginate(3, 5);

      expect(result).toEqual({
        limit: 5,
        offset: 10
      });
    });

    test('should use default values when no parameters provided', () => {
      const result = paginate();

      expect(result).toEqual({
        limit: 10,
        offset: 0
      });
    });

    test('should use default limit when only page provided', () => {
      const result = paginate(2);

      expect(result).toEqual({
        limit: 10,
        offset: 10
      });
    });

    test('should handle string inputs by parsing to integers', () => {
      const result = paginate('3', '20');

      expect(result).toEqual({
        limit: 20,
        offset: 40
      });
    });

    test('should handle edge case with page 0', () => {
      const result = paginate(0, 10);

      expect(result).toEqual({
        limit: 10,
        offset: -10
      });
    });

    test('should handle negative page numbers', () => {
      const result = paginate(-1, 10);

      expect(result).toEqual({
        limit: 10,
        offset: -20
      });
    });

    test('should handle large page numbers', () => {
      const result = paginate(100, 25);

      expect(result).toEqual({
        limit: 25,
        offset: 2475
      });
    });

    test('should handle decimal inputs by parsing to integers', () => {
      const result = paginate(2.7, 10.9);

      expect(result).toEqual({
        limit: 10,
        offset: 10
      });
    });
  });

  describe('createPaginationMeta', () => {
    test('should create correct pagination metadata for first page', () => {
      const result = createPaginationMeta(100, 1, 10);

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false
      });
    });

    test('should create correct pagination metadata for middle page', () => {
      const result = createPaginationMeta(100, 5, 10);

      expect(result).toEqual({
        currentPage: 5,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: true
      });
    });

    test('should create correct pagination metadata for last page', () => {
      const result = createPaginationMeta(100, 10, 10);

      expect(result).toEqual({
        currentPage: 10,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: true
      });
    });

    test('should handle case with no items', () => {
      const result = createPaginationMeta(0, 1, 10);

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
    });

    test('should handle case with fewer items than page size', () => {
      const result = createPaginationMeta(5, 1, 10);

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
    });

    test('should handle case with exact page size', () => {
      const result = createPaginationMeta(10, 1, 10);

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
    });

    test('should handle string inputs by parsing to integers', () => {
      const result = createPaginationMeta(100, '3', '20');

      expect(result).toEqual({
        currentPage: 3,
        totalPages: 5,
        totalItems: 100,
        itemsPerPage: 20,
        hasNextPage: true,
        hasPrevPage: true
      });
    });

    test('should calculate total pages correctly with remainder', () => {
      const result = createPaginationMeta(23, 1, 10);

      expect(result).toEqual({
        currentPage: 1,
        totalPages: 3,
        totalItems: 23,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false
      });
    });

    test('should handle large numbers', () => {
      const result = createPaginationMeta(10000, 50, 100);

      expect(result).toEqual({
        currentPage: 50,
        totalPages: 100,
        totalItems: 10000,
        itemsPerPage: 100,
        hasNextPage: true,
        hasPrevPage: true
      });
    });

    test('should handle edge case where page exceeds total pages', () => {
      const result = createPaginationMeta(25, 5, 10);

      expect(result).toEqual({
        currentPage: 5,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: true
      });
    });

    test('should handle decimal inputs by parsing to integers', () => {
      const result = createPaginationMeta(100.7, 2.9, 10.1);

      expect(result).toEqual({
        currentPage: 2,
        totalPages: 11,
        totalItems: 100,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: true
      });
    });
  });
});