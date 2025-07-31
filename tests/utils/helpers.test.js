const { filterObject, buildWhereClause, asyncHandler } = require('../../utils/helpers');

describe('Utility Functions - helpers.js', () => {
  describe('filterObject', () => {
    test('should remove undefined values from object', () => {
      const input = {
        name: 'John',
        age: undefined,
        email: 'john@example.com',
        phone: null,
        address: ''
      };

      const result = filterObject(input);

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com'
      });
    });

    test('should return empty object when all values are undefined/null/empty', () => {
      const input = {
        a: undefined,
        b: null,
        c: ''
      };

      const result = filterObject(input);

      expect(result).toEqual({});
    });

    test('should preserve falsy values that are not undefined/null/empty', () => {
      const input = {
        isActive: false,
        count: 0,
        name: 'test',
        empty: '',
        nullValue: null,
        undefinedValue: undefined
      };

      const result = filterObject(input);

      expect(result).toEqual({
        isActive: false,
        count: 0,
        name: 'test'
      });
    });

    test('should handle empty object', () => {
      const input = {};
      const result = filterObject(input);

      expect(result).toEqual({});
    });

    test('should handle object with nested objects and arrays', () => {
      const input = {
        user: { name: 'John' },
        tags: ['tag1', 'tag2'],
        empty: '',
        valid: 'value'
      };

      const result = filterObject(input);

      expect(result).toEqual({
        user: { name: 'John' },
        tags: ['tag1', 'tag2'],
        valid: 'value'
      });
    });
  });

  describe('buildWhereClause', () => {
    test('should build where clause with allowed filters', () => {
      const query = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
        unauthorized: 'should not be included'
      };

      const allowedFilters = ['name', 'age', 'email'];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({
        name: 'John',
        age: 25,
        email: 'john@example.com'
      });
    });

    test('should exclude undefined, null, and empty string values', () => {
      const query = {
        name: 'John',
        age: undefined,
        email: null,
        phone: '',
        city: 'New York'
      };

      const allowedFilters = ['name', 'age', 'email', 'phone', 'city'];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({
        name: 'John',
        city: 'New York'
      });
    });

    test('should return empty object when no allowed filters match', () => {
      const query = {
        name: 'John',
        age: 25
      };

      const allowedFilters = ['email', 'phone'];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({});
    });

    test('should handle empty query object', () => {
      const query = {};
      const allowedFilters = ['name', 'age'];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({});
    });

    test('should handle empty allowed filters array', () => {
      const query = {
        name: 'John',
        age: 25
      };

      const allowedFilters = [];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({});
    });

    test('should preserve falsy values that are not undefined/null/empty', () => {
      const query = {
        isActive: false,
        count: 0,
        rating: 0.0,
        name: 'test'
      };

      const allowedFilters = ['isActive', 'count', 'rating', 'name'];
      const result = buildWhereClause(query, allowedFilters);

      expect(result).toEqual({
        isActive: false,
        count: 0,
        rating: 0.0,
        name: 'test'
      });
    });
  });

  describe('asyncHandler', () => {
    test('should call next with error when async function throws', async () => {
      const error = new Error('Test error');
      const asyncFunction = jest.fn().mockRejectedValue(error);
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFunction = asyncHandler(asyncFunction);
      await wrappedFunction(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
    });

    test('should not call next when async function succeeds', async () => {
      const asyncFunction = jest.fn().mockResolvedValue('success');
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFunction = asyncHandler(asyncFunction);
      await wrappedFunction(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
    });

    test('should handle synchronous functions that return promises', async () => {
      const syncFunction = jest.fn().mockReturnValue(Promise.resolve('success'));
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFunction = asyncHandler(syncFunction);
      await wrappedFunction(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(syncFunction).toHaveBeenCalledWith(req, res, next);
    });

    test('should handle functions that throw synchronously', async () => {
      const error = new Error('Sync error');
      const syncFunction = jest.fn().mockImplementation(() => {
        throw error;
      });
      const req = {};
      const res = {};
      const next = jest.fn();

      const wrappedFunction = asyncHandler(syncFunction);
      await wrappedFunction(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(syncFunction).toHaveBeenCalledWith(req, res, next);
    });

    test('should pass through req, res, and next parameters correctly', async () => {
      const asyncFunction = jest.fn().mockResolvedValue('success');
      const req = { body: { test: 'data' } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      const wrappedFunction = asyncHandler(asyncFunction);
      await wrappedFunction(req, res, next);

      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
    });
  });
});