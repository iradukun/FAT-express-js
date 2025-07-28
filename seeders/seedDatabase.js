const bcrypt = require('bcryptjs');
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

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create Managers
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const [manager1] = await Manager.findOrCreate({
      where: { email: 'john.smith@university.edu' },
      defaults: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@university.edu',
        password: hashedPassword
      }
    });

    const [manager2] = await Manager.findOrCreate({
      where: { email: 'sarah.johnson@university.edu' },
      defaults: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@university.edu',
        password: hashedPassword
      }
    });

    console.log('Managers created/found');

    // Create Facilitators
    const [facilitator1] = await Facilitator.findOrCreate({
      where: { email: 'michael.brown@university.edu' },
      defaults: {
        firstName: 'Dr. Michael',
        lastName: 'Brown',
        email: 'michael.brown@university.edu',
        password: hashedPassword,
        employeeId: 'EMP001',
        department: 'Computer Science'
      }
    });

    const [facilitator2] = await Facilitator.findOrCreate({
      where: { email: 'lisa.davis@university.edu' },
      defaults: {
        firstName: 'Prof. Lisa',
        lastName: 'Davis',
        email: 'lisa.davis@university.edu',
        password: hashedPassword,
        employeeId: 'EMP002',
        department: 'Information Technology'
      }
    });

    const [facilitator3] = await Facilitator.findOrCreate({
      where: { email: 'robert.wilson@university.edu' },
      defaults: {
        firstName: 'Dr. Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@university.edu',
        password: hashedPassword,
        employeeId: 'EMP003',
        department: 'Software Engineering'
      }
    });

    console.log('Facilitators created/found');

    // Create Modes
    const [onlineMode] = await Mode.findOrCreate({
      where: { name: 'Online' },
      defaults: {
        name: 'Online',
        description: 'Fully online delivery mode'
      }
    });

    const [inPersonMode] = await Mode.findOrCreate({
      where: { name: 'In-person' },
      defaults: {
        name: 'In-person',
        description: 'Traditional face-to-face delivery'
      }
    });

    const [hybridMode] = await Mode.findOrCreate({
      where: { name: 'Hybrid' },
      defaults: {
        name: 'Hybrid',
        description: 'Combination of online and in-person delivery'
      }
    });

    console.log('Modes created/found');

    // Create Modules
    const [module1] = await Module.findOrCreate({
      where: { code: 'CS101' },
      defaults: {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts using Python',
        credits: 6,
        level: 'undergraduate'
      }
    });

    const [module2] = await Module.findOrCreate({
      where: { code: 'CS201' },
      defaults: {
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        description: 'Advanced data structures and algorithmic thinking',
        credits: 6,
        level: 'undergraduate'
      }
    });

    const [module3] = await Module.findOrCreate({
      where: { code: 'IT301' },
      defaults: {
        code: 'IT301',
        name: 'Database Systems',
        description: 'Relational database design and SQL',
        credits: 6,
        level: 'undergraduate'
      }
    });

    const [module4] = await Module.findOrCreate({
      where: { code: 'SE401' },
      defaults: {
        code: 'SE401',
        name: 'Software Engineering Principles',
        description: 'Software development lifecycle and methodologies',
        credits: 8,
        level: 'postgraduate'
      }
    });

    console.log('Modules created/found');

    // Create Classes
    const [class1] = await Class.findOrCreate({
      where: { code: '2024S' },
      defaults: {
        code: '2024S',
        trimester: 'T1',
        year: 2024,
        startDate: '2024-02-01',
        endDate: '2024-05-31'
      }
    });

    const [class2] = await Class.findOrCreate({
      where: { code: '2024M' },
      defaults: {
        code: '2024M',
        trimester: 'T2',
        year: 2024,
        startDate: '2024-06-01',
        endDate: '2024-09-30'
      }
    });

    const [class3] = await Class.findOrCreate({
      where: { code: '2025J' },
      defaults: {
        code: '2025J',
        trimester: 'T1',
        year: 2025,
        startDate: '2025-02-01',
        endDate: '2025-05-31'
      }
    });

    console.log('Classes created/found');

    // Create Cohorts
    const [cohort1] = await Cohort.findOrCreate({
      where: { name: '2024 Software Engineering' },
      defaults: {
        name: '2024 Software Engineering',
        year: 2024,
        program: 'Bachelor of Software Engineering',
        startDate: '2024-02-01',
        endDate: '2027-11-30',
        maxStudents: 30
      }
    });

    const [cohort2] = await Cohort.findOrCreate({
      where: { name: '2024 Computer Science' },
      defaults: {
        name: '2024 Computer Science',
        year: 2024,
        program: 'Bachelor of Computer Science',
        startDate: '2024-02-01',
        endDate: '2027-11-30',
        maxStudents: 25
      }
    });

    const [cohort3] = await Cohort.findOrCreate({
      where: { name: '2024 IT Masters' },
      defaults: {
        name: '2024 IT Masters',
        year: 2024,
        program: 'Master of Information Technology',
        startDate: '2024-02-01',
        endDate: '2026-11-30',
        maxStudents: 20
      }
    });

    console.log('Cohorts created/found');

    // Create Students
    const students = [
      {
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice.anderson@student.edu',
        studentId: 'STU001',
        cohortId: cohort1.id,
        enrollmentDate: '2024-02-01'
      },
      {
        firstName: 'Bob',
        lastName: 'Baker',
        email: 'bob.baker@student.edu',
        studentId: 'STU002',
        cohortId: cohort1.id,
        enrollmentDate: '2024-02-01'
      },
      {
        firstName: 'Carol',
        lastName: 'Clark',
        email: 'carol.clark@student.edu',
        studentId: 'STU003',
        cohortId: cohort2.id,
        enrollmentDate: '2024-02-01'
      },
      {
        firstName: 'David',
        lastName: 'Davis',
        email: 'david.davis@student.edu',
        studentId: 'STU004',
        cohortId: cohort2.id,
        enrollmentDate: '2024-02-01'
      },
      {
        firstName: 'Emma',
        lastName: 'Evans',
        email: 'emma.evans@student.edu',
        studentId: 'STU005',
        cohortId: cohort3.id,
        enrollmentDate: '2024-02-01'
      }
    ];

    // Create students one by one to handle duplicates
    for (const studentData of students) {
      await Student.findOrCreate({
        where: { email: studentData.email },
        defaults: studentData
      });
    }
    console.log('Students created/found');

    // Create Course Offerings
    const courseOfferings = [
      {
        moduleId: module1.id,
        classId: class1.id,
        cohortId: cohort1.id,
        facilitatorId: facilitator1.id,
        modeId: hybridMode.id,
        intakePeriod: 'HT1',
        maxStudents: 30,
        startDate: '2024-02-01',
        endDate: '2024-05-31'
      },
      {
        moduleId: module2.id,
        classId: class1.id,
        cohortId: cohort1.id,
        facilitatorId: facilitator2.id,
        modeId: inPersonMode.id,
        intakePeriod: 'HT1',
        maxStudents: 30,
        startDate: '2024-02-01',
        endDate: '2024-05-31'
      },
      {
        moduleId: module1.id,
        classId: class1.id,
        cohortId: cohort2.id,
        facilitatorId: facilitator1.id,
        modeId: onlineMode.id,
        intakePeriod: 'HT1',
        maxStudents: 25,
        startDate: '2024-02-01',
        endDate: '2024-05-31'
      },
      {
        moduleId: module3.id,
        classId: class2.id,
        cohortId: cohort2.id,
        facilitatorId: facilitator2.id,
        modeId: hybridMode.id,
        intakePeriod: 'HT2',
        maxStudents: 25,
        startDate: '2024-06-01',
        endDate: '2024-09-30'
      },
      {
        moduleId: module4.id,
        classId: class1.id,
        cohortId: cohort3.id,
        facilitatorId: facilitator3.id,
        modeId: inPersonMode.id,
        intakePeriod: 'FT',
        maxStudents: 20,
        startDate: '2024-02-01',
        endDate: '2024-05-31'
      }
    ];

    // Create course offerings one by one to handle duplicates
    for (const offeringData of courseOfferings) {
      await CourseOffering.findOrCreate({
        where: {
          moduleId: offeringData.moduleId,
          classId: offeringData.classId,
          cohortId: offeringData.cohortId
        },
        defaults: offeringData
      });
    }
    console.log('Course offerings created/found');

    console.log('Database seeding completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Manager: john.smith@university.edu / password123');
    console.log('Manager: sarah.johnson@university.edu / password123');
    console.log('Facilitator: michael.brown@university.edu / password123');
    console.log('Facilitator: lisa.davis@university.edu / password123');
    console.log('Facilitator: robert.wilson@university.edu / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;