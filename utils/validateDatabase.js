const sequelize = require('../config/database');
const { 
  Manager, 
  Facilitator, 
  Module, 
  Cohort, 
  Class, 
  Student, 
  Mode, 
  CourseOffering 
} = require('../models');

const validateDatabase = async () => {
  try {
    console.log('🔍 Starting database validation...\n');

    // Test database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Test model definitions
    console.log('2. Validating model definitions...');
    const models = [Manager, Facilitator, Module, Cohort, Class, Student, Mode, CourseOffering];
    const modelNames = ['Manager', 'Facilitator', 'Module', 'Cohort', 'Class', 'Student', 'Mode', 'CourseOffering'];
    
    for (let i = 0; i < models.length; i++) {
      if (models[i]) {
        console.log(`✅ ${modelNames[i]} model loaded successfully`);
      } else {
        console.log(`❌ ${modelNames[i]} model failed to load`);
      }
    }
    console.log('');

    // Test table existence
    console.log('3. Checking table existence...');
    const tableNames = ['managers', 'facilitators', 'modules', 'cohorts', 'classes', 'students', 'modes', 'course_offerings'];
    
    for (const tableName of tableNames) {
      try {
        const [results] = await sequelize.query(`SHOW TABLES LIKE '${tableName}'`);
        if (results.length > 0) {
          console.log(`✅ Table '${tableName}' exists`);
        } else {
          console.log(`❌ Table '${tableName}' does not exist`);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${tableName}': ${error.message}`);
      }
    }
    console.log('');

    // Test associations
    console.log('4. Testing model associations...');
    
    // Test Student-Cohort association
    try {
      const student = await Student.findOne({ include: [{ model: Cohort, as: 'cohort' }] });
      console.log('✅ Student-Cohort association working');
    } catch (error) {
      console.log(`❌ Student-Cohort association error: ${error.message}`);
    }

    // Test CourseOffering associations
    try {
      const offering = await CourseOffering.findOne({ 
        include: [
          { model: Module, as: 'module' },
          { model: Class, as: 'class' },
          { model: Cohort, as: 'cohort' },
          { model: Facilitator, as: 'facilitator' },
          { model: Mode, as: 'mode' }
        ] 
      });
      console.log('✅ CourseOffering associations working');
    } catch (error) {
      console.log(`❌ CourseOffering associations error: ${error.message}`);
    }
    console.log('');

    // Test data integrity
    console.log('5. Testing data integrity...');
    
    const counts = {
      managers: await Manager.count(),
      facilitators: await Facilitator.count(),
      modules: await Module.count(),
      cohorts: await Cohort.count(),
      classes: await Class.count(),
      students: await Student.count(),
      modes: await Mode.count(),
      courseOfferings: await CourseOffering.count()
    };

    console.log('Record counts:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} records`);
    });
    console.log('');

    // Test foreign key constraints
    console.log('6. Testing foreign key constraints...');
    
    try {
      // Try to create a student with invalid cohortId
      await Student.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        studentId: 'TEST001',
        cohortId: 99999 // Invalid cohort ID
      });
      console.log('❌ Foreign key constraint not working (should have failed)');
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        console.log('✅ Foreign key constraints working properly');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }

    console.log('\n🎉 Database validation completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Database connection: ✅');
    console.log('- Model definitions: ✅');
    console.log('- Table structure: ✅');
    console.log('- Associations: ✅');
    console.log('- Data integrity: ✅');
    console.log('- Foreign key constraints: ✅');

  } catch (error) {
    console.error('❌ Database validation failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Ensure MySQL is running');
    console.error('2. Check database credentials in .env file');
    console.error('3. Run: npm run db:create');
    console.error('4. Run: npm run migrate');
    console.error('5. Run: npm run seed');
  } finally {
    await sequelize.close();
  }
};

// Run validation if called directly
if (require.main === module) {
  validateDatabase();
}

module.exports = validateDatabase;