# Test Suite

This directory contains unit tests for the Course Management System.

## Test Structure

```
tests/
├── models/
│   ├── ActivityTracker.test.js    # Tests for ActivityTracker model
│   ├── Module.test.js             # Tests for Module model
│   └── CourseOffering.test.js     # Tests for CourseOffering model
├── utils/
│   ├── helpers.test.js            # Tests for helper utilities
│   └── pagination.test.js         # Tests for pagination utilities
└── setup.js                      # Test environment setup
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Models (3 models tested)
- **ActivityTracker**: Model creation, validation, associations, unique constraints
- **Module**: Model creation, validation, enum values, unique constraints
- **CourseOffering**: Model creation, validation, associations, enum values

### Utilities (2 utility modules tested)
- **helpers.js**: filterObject, buildWhereClause, asyncHandler functions
- **pagination.js**: paginate, createPaginationMeta functions

## Test Environment

Tests use a separate test database configuration and environment variables defined in `.env.test`.

## Test Framework

- **Jest**: Testing framework
- **Supertest**: HTTP assertion library (available for integration tests)
- **Sequelize**: ORM with in-memory/test database support

## Notes

- Tests use `force: true` for database sync to ensure clean state
- Each test file manages its own database lifecycle
- Mock functions are used for testing utility functions
- Tests cover both positive and negative scenarios including edge cases