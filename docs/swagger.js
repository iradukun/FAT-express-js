const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import all swagger documentation modules
const commonSwagger = require('./common.swagger');
const authSwagger = require('./auth.swagger');
const managersSwagger = require('./managers.swagger');
const facilitatorsSwagger = require('./facilitators.swagger');
const modulesSwagger = require('./modules.swagger');
const classesSwagger = require('./classes.swagger');
const cohortsSwagger = require('./cohorts.swagger');
const studentsSwagger = require('./students.swagger');
const courseOfferingsSwagger = require('./courseOfferings.swagger');
const activityTrackerSwagger = require('./activityTracker.swagger');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management System API',
      version: '1.0.0',
      description: 'A comprehensive course management system API built with Express.js and Sequelize',
      contact: {
        name: 'API Support',
        email: 'support@coursemanagement.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.coursemanagement.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        // Success and Error responses
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Email is required'
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        
        // Pagination
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1
            },
            totalPages: {
              type: 'integer',
              example: 10
            },
            totalItems: {
              type: 'integer',
              example: 100
            },
            itemsPerPage: {
              type: 'integer',
              example: 10
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              example: false
            }
          }
        },

        // Data Models
        Manager: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        Facilitator: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'Jane'
            },
            lastName: {
              type: 'string',
              example: 'Smith'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jane.smith@example.com'
            },
            employeeId: {
              type: 'string',
              example: 'EMP001'
            },
            department: {
              type: 'string',
              example: 'Computer Science'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        Module: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            moduleCode: {
              type: 'string',
              example: 'CS101'
            },
            moduleName: {
              type: 'string',
              example: 'Introduction to Computer Science'
            },
            description: {
              type: 'string',
              example: 'Basic concepts of computer science'
            },
            credits: {
              type: 'integer',
              example: 3
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        Class: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            classCode: {
              type: 'string',
              example: 'ROOM101'
            },
            className: {
              type: 'string',
              example: 'Computer Lab 1'
            },
            description: {
              type: 'string',
              example: 'Main computer laboratory'
            },
            capacity: {
              type: 'integer',
              example: 30
            },
            location: {
              type: 'string',
              example: 'Building A, Floor 1'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        Cohort: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            cohortName: {
              type: 'string',
              example: 'CS2024A'
            },
            program: {
              type: 'string',
              example: 'Computer Science'
            },
            year: {
              type: 'integer',
              example: 2024
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-12-15'
            },
            description: {
              type: 'string',
              example: 'Computer Science cohort for 2024'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'Alice'
            },
            lastName: {
              type: 'string',
              example: 'Johnson'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'alice.johnson@student.example.com'
            },
            studentId: {
              type: 'string',
              example: 'STU001'
            },
            cohortId: {
              type: 'integer',
              example: 1
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              example: '2000-05-15'
            },
            phone: {
              type: 'string',
              example: '+1234567890'
            },
            address: {
              type: 'string',
              example: '123 Main St, City, State'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        CourseOffering: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            moduleId: {
              type: 'integer',
              example: 1
            },
            facilitatorId: {
              type: 'integer',
              example: 1
            },
            cohortId: {
              type: 'integer',
              example: 1
            },
            classId: {
              type: 'integer',
              example: 1
            },
            modeId: {
              type: 'integer',
              example: 1
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-05-15'
            },
            schedule: {
              type: 'string',
              example: 'Monday, Wednesday, Friday 9:00-11:00 AM'
            },
            notes: {
              type: 'string',
              example: 'Additional course information'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            },
            Module: {
              $ref: '#/components/schemas/Module'
            },
            Facilitator: {
              $ref: '#/components/schemas/Facilitator'
            },
            Cohort: {
              $ref: '#/components/schemas/Cohort'
            },
            Class: {
              $ref: '#/components/schemas/Class'
            },
            Mode: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1
                },
                modeName: {
                  type: 'string',
                  example: 'In-Person'
                },
                description: {
                  type: 'string',
                  example: 'Face-to-face classroom instruction'
                }
              }
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Authentication required',
                error: 'No token provided',
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        Forbidden: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Insufficient permissions',
                error: 'Manager access required',
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found',
                error: 'The requested resource does not exist',
                timestamp: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './docs/*.swagger.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};