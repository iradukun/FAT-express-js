# Database Setup Guide

This guide will help you set up the database for the Course Management System.

## Prerequisites

1. **MySQL Server**: Make sure MySQL is installed and running on your system
2. **Node.js**: Version 16 or higher
3. **npm**: Version 8 or higher

## Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials:
   ```env
   DB_NAME=course_allocation_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   NODE_ENV=development
   ```

## Database Setup Commands

### Option 1: Quick Setup (Recommended for first-time setup)
```bash
# Install dependencies
npm install

# Create database, run migrations, and seed data
npm run db:setup
```

### Option 2: Step-by-step Setup
```bash
# Install dependencies
npm install

# Create the database
npm run db:create

# Run migrations to create tables
npm run migrate

# Seed the database with sample data
npm run seed
```

### Option 3: Reset Database (Use when you need to start fresh)
```bash
# This will drop the database, recreate it, run migrations, and seed data
npm run db:reset
```

## Useful Database Commands

### Migration Commands
- `npm run migrate` - Run pending migrations
- `npm run migrate:undo` - Undo the last migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm run migrate:status` - Check migration status

### Seeding Commands
- `npm run seed` - Run custom seeder (recommended)
- `npm run seed:cli` - Run all Sequelize CLI seeders
- `npm run seed:undo` - Undo all seeders

### Database Management
- `npm run db:create` - Create the database
- `npm run db:drop` - Drop the database

## Troubleshooting

### Common Issues

1. **Connection Error**: 
   - Ensure MySQL is running
   - Check your database credentials in `.env`
   - Verify the database user has proper permissions

2. **Migration Errors**:
   - Check if the database exists: `npm run db:create`
   - Ensure all previous migrations ran successfully: `npm run migrate:status`

3. **Foreign Key Constraint Errors**:
   - The migrations are ordered to handle dependencies correctly
   - If you encounter issues, try: `npm run db:reset`

### Database Schema

The system creates the following tables in order:
1. `managers` - System managers
2. `facilitators` - Course facilitators/instructors
3. `modes` - Delivery modes (Online, In-person, Hybrid)
4. `modules` - Course modules
5. `cohorts` - Student cohorts
6. `classes` - Academic classes/terms
7. `students` - Student records (references cohorts)
8. `course_offerings` - Course offerings (references modules, classes, cohorts, facilitators, modes)

### Sample Data

The seeder creates:
- 2 Managers
- 3 Facilitators
- 3 Delivery Modes
- 4 Modules
- 3 Classes
- 3 Cohorts
- 6 Students
- 6 Course Offerings

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use environment variables for database configuration
3. Run migrations: `npm run migrate`
4. Optionally seed initial data: `npm run seed`

## Backup and Restore

### Backup
```bash
mysqldump -u root -p course_allocation_db > backup.sql
```

### Restore
```bash
mysql -u root -p course_allocation_db < backup.sql
```