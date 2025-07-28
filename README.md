# Course Management System API

A comprehensive RESTful API for managing educational institutions, built with Express.js, Sequelize ORM, and MySQL. This system provides complete functionality for managing managers, facilitators, students, modules, classes, cohorts, and course offerings with enterprise-grade security and documentation.

## 🚀 Features

- **User Management**: Secure authentication and authorization for managers and facilitators
- **Student Management**: Complete CRUD operations for student records with cohort assignments
- **Module Management**: Manage academic modules with credits, levels, and detailed descriptions
- **Class Management**: Handle physical and virtual classroom resources with capacity tracking
- **Cohort Management**: Organize students into cohorts by program and year with date tracking
- **Course Offerings**: Schedule and manage course deliveries with comprehensive relationships
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation with interactive UI
- **Security**: JWT authentication, rate limiting, CORS protection, input validation
- **Database**: MySQL with Sequelize ORM for reliable data management and migrations
- **Error Handling**: Robust error handling with detailed logging and user-friendly responses
- **Pagination**: Built-in pagination support for all list endpoints
- **Filtering**: Advanced filtering capabilities for efficient data retrieval

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Documentation**: Swagger/OpenAPI 3.0 with Swagger UI
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator with Joi schemas
- **Testing**: Jest with Supertest
- **Development**: Nodemon, ESLint for code quality

## 🏗️ Project Structure

```
EXPRESS/
├── config/
│   ├── database.js          # Database configuration
│   └── config.json          # Sequelize configuration
├── controllers/
│   ├── index.js             # Controller exports
│   ├── authController.js    # Authentication logic
│   ├── managersController.js
│   ├── facilitatorsController.js
│   ├── studentsController.js
│   ├── modulesController.js
│   ├── classesController.js
│   ├── cohortsController.js
│   └── courseOfferingsController.js
├── docs/
│   ├── swagger.js           # Main Swagger configuration
│   ├── common.swagger.js    # Common Swagger components
│   ├── auth.swagger.js      # Auth endpoint documentation
│   ├── managers.swagger.js
│   ├── facilitators.swagger.js
│   ├── students.swagger.js
│   ├── modules.swagger.js
│   ├── classes.swagger.js
│   ├── cohorts.swagger.js
│   └── courseOfferings.swagger.js
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Validation middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── index.js             # Model exports and associations
│   ├── Manager.js
│   ├── Facilitator.js
│   ├── Student.js
│   ├── Module.js
│   ├── Class.js
│   ├── Cohort.js
│   ├── CourseOffering.js
│   └── Mode.js
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── managers.js
│   ├── facilitators.js
│   ├── students.js
│   ├── modules.js
│   ├── classes.js
│   ├── cohorts.js
│   └── courseOfferings.js
├── seeders/                 # Database seeders
│   ├── seedDatabase.js      # Database seeder
│   └── runSeeder.js         # Seeder runner script
├── utils/                   # Utility functions
├── migrations/              # Database migrations
├── tests/                   # Test files
├── server.js                # Main application file
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EXPRESS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=course_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DIALECT=mysql

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   API_BASE_URL=http://localhost:3000

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=24h

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Database Setup**
   ```bash
   # Create database
   npm run db:create

   # Run migrations
   npm run migrate

   # Seed database (optional)
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Manager**: Full access to all resources
- **Facilitator**: Read access to most resources, limited write access

## 📖 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/manager` - Register new manager
- `POST /api/auth/register/facilitator` - Register new facilitator

### Managers
- `GET /api/managers` - Get all managers (with pagination)
- `GET /api/managers/:id` - Get manager by ID
- `PUT /api/managers/:id` - Update manager
- `DELETE /api/managers/:id` - Delete manager

### Facilitators
- `GET /api/facilitators` - Get all facilitators (with pagination)
- `GET /api/facilitators/:id` - Get facilitator by ID
- `PUT /api/facilitators/:id` - Update facilitator
- `DELETE /api/facilitators/:id` - Delete facilitator
- `GET /api/facilitators/:id/assignments` - Get facilitator assignments

### Students
- `GET /api/students` - Get all students (with pagination)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Modules
- `GET /api/modules` - Get all modules (with pagination)
- `POST /api/modules` - Create new module
- `GET /api/modules/:id` - Get module by ID
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Classes
- `GET /api/classes` - Get all classes (with pagination)
- `POST /api/classes` - Create new class
- `GET /api/classes/:id` - Get class by ID
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Cohorts
- `GET /api/cohorts` - Get all cohorts (with pagination)
- `POST /api/cohorts` - Create new cohort
- `GET /api/cohorts/:id` - Get cohort by ID
- `PUT /api/cohorts/:id` - Update cohort
- `DELETE /api/cohorts/:id` - Delete cohort

### Course Offerings
- `GET /api/course-offerings` - Get all course offerings (with pagination)
- `POST /api/course-offerings` - Create new course offering
- `GET /api/course-offerings/:id` - Get course offering by ID
- `PUT /api/course-offerings/:id` - Update course offering
- `DELETE /api/course-offerings/:id` - Delete course offering

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm run migrate:status` - Check migration status
- `npm run seed` - Seed database with sample data
- `npm run seed:undo` - Undo database seeding
- `npm run db:create` - Create database
- `npm run db:drop` - Drop database
- `npm run db:setup` - Create database, run migrations, and seed data
- `npm run db:reset` - Drop, recreate, migrate, and seed database
- `npm run db:validate` - Validate database setup and integrity
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🗄️ Database Schema

### Core Entities
- **Managers**: System administrators with full access
- **Facilitators**: Instructors who deliver courses
- **Students**: Learners enrolled in programs
- **Modules**: Academic subjects/courses
- **Classes**: Physical or virtual learning spaces
- **Cohorts**: Groups of students in the same program/year
- **Course Offerings**: Scheduled delivery of modules to cohorts
- **Modes**: Delivery methods (In-Person, Online, Hybrid)

### Relationships
- Students belong to Cohorts
- Course Offerings link Modules, Facilitators, Cohorts, and Classes
- Facilitators can be assigned to multiple Course Offerings
- Modules can be offered multiple times to different cohorts

## 🔧 Configuration

### Environment Variables
- `DB_*`: Database connection settings
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_*`: Rate limiting configuration

### Security Features
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Key Features

### Role-Based Access Control
- **Managers**: Full CRUD access to all resources
- **Facilitators**: Read access to most resources, can view their own assignments

### Pagination and Filtering
Most GET endpoints support:
- **Pagination**: `page`, `limit` parameters
- **Filtering**: Resource-specific filter parameters
- **Sorting**: Configurable sort options

### Data Validation
- Comprehensive input validation using express-validator
- Unique constraints on critical fields (emails, IDs, codes)
- Foreign key validation for relationships
- Custom validation rules for business logic

### Error Handling
- Structured error responses with consistent format
- Detailed error logging for debugging
- User-friendly error messages
- Proper HTTP status codes

## 🛠️ Development

### Adding New Features
1. Create/modify models in `/models`
2. Update associations in `/models/index.js`
3. Create controllers in `/controllers`
4. Create routes in `/routes`
5. Add authentication/validation middleware as needed
6. Update Swagger documentation in `/docs`
7. Add tests for new functionality

### Code Quality
- ESLint configuration for consistent code style
- Prettier for code formatting
- Comprehensive error handling
- Input validation on all endpoints
- Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@coursemanagement.com

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD operations for all entities
- Comprehensive API documentation
- JWT authentication and authorization
- Database migrations and seeders
- Input validation and error handling
- Rate limiting and security features

---

**Built with ❤️ using Express.js, Sequelize, and MySQL**