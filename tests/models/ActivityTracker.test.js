const { ActivityTracker, CourseOffering, Module, Class, Cohort, Facilitator, Mode } = require('../../models');
const sequelize = require('../../config/database');

describe('ActivityTracker Model', () => {
  let courseOffering;
  let module, classEntity, cohort, facilitator, mode;

  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });

    // Create test data
    module = await Module.create({
      code: 'TEST101',
      name: 'Test Module',
      description: 'Test module for activity tracker',
      credits: 3,
      level: 'undergraduate'
    });

    classEntity = await Class.create({
      name: '2024S',
      trimester: 'S1',
      year: 2024,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30')
    });

    cohort = await Cohort.create({
      name: 'cohort1',
      year: 2024
    });

    facilitator = await Facilitator.create({
      email: 'test.facilitator@example.com',
      password: 'hashedpassword',
      firstName: 'Test',
      lastName: 'Facilitator',
      employeeId: 'EMP001'
    });

    mode = await Mode.create({
      name: 'online'
    });

    courseOffering = await CourseOffering.create({
      moduleId: module.id,
      classId: classEntity.id,
      cohortId: cohort.id,
      facilitatorId: facilitator.id,
      modeId: mode.id,
      trimester: 'S1',
      intakePeriod: 'HT1',
      year: 2024
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Model Creation', () => {
    test('should create an activity tracker with valid data', async () => {
      const activityTracker = await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 1,
        attendance: [true, false, true],
        formativeOneGrading: 'Done',
        formativeTwoGrading: 'Pending',
        summativeGrading: 'Not Started',
        courseModeration: 'Done',
        intranetSync: 'Pending',
        gradeBookStatus: 'Not Started'
      });

      expect(activityTracker).toBeDefined();
      expect(activityTracker.allocationId).toBe(courseOffering.id);
      expect(activityTracker.weekNumber).toBe(1);
      expect(activityTracker.attendance).toEqual([true, false, true]);
      expect(activityTracker.formativeOneGrading).toBe('Done');
      expect(activityTracker.formativeTwoGrading).toBe('Pending');
      expect(activityTracker.summativeGrading).toBe('Not Started');
      expect(activityTracker.courseModeration).toBe('Done');
      expect(activityTracker.intranetSync).toBe('Pending');
      expect(activityTracker.gradeBookStatus).toBe('Not Started');
    });

    test('should create an activity tracker with default values', async () => {
      const activityTracker = await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 2,
        attendance: [true, true, false]
      });

      expect(activityTracker.formativeOneGrading).toBe('Not Started');
      expect(activityTracker.formativeTwoGrading).toBe('Not Started');
      expect(activityTracker.summativeGrading).toBe('Not Started');
      expect(activityTracker.courseModeration).toBe('Not Started');
      expect(activityTracker.intranetSync).toBe('Not Started');
      expect(activityTracker.gradeBookStatus).toBe('Not Started');
    });
  });

  describe('Model Validation', () => {
    test('should fail validation without required allocationId', async () => {
      await expect(ActivityTracker.create({
        weekNumber: 1,
        attendance: [true, false]
      })).rejects.toThrow();
    });

    test('should fail validation without required weekNumber', async () => {
      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        attendance: [true, false]
      })).rejects.toThrow();
    });

    test('should fail validation without required attendance', async () => {
      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 1
      })).rejects.toThrow();
    });

    test('should fail validation with invalid status enum values', async () => {
      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 1,
        attendance: [true, false],
        formativeOneGrading: 'Invalid Status'
      })).rejects.toThrow();
    });

    test('should fail validation with negative week number', async () => {
      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: -1,
        attendance: [true, false]
      })).rejects.toThrow();
    });

    test('should fail validation with week number greater than 52', async () => {
      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 53,
        attendance: [true, false]
      })).rejects.toThrow();
    });
  });

  describe('Model Associations', () => {
    test('should belong to CourseOffering', async () => {
      const activityTracker = await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 3,
        attendance: [true, true, true]
      });

      const trackerWithOffering = await ActivityTracker.findByPk(activityTracker.id, {
        include: [{ model: CourseOffering, as: 'courseOffering' }]
      });

      expect(trackerWithOffering.courseOffering).toBeDefined();
      expect(trackerWithOffering.courseOffering.id).toBe(courseOffering.id);
    });
  });

  describe('Model Methods', () => {
    test('should update activity tracker fields', async () => {
      const activityTracker = await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 4,
        attendance: [true, false, true],
        formativeOneGrading: 'Not Started'
      });

      await activityTracker.update({
        formativeOneGrading: 'Done',
        formativeTwoGrading: 'Pending'
      });

      expect(activityTracker.formativeOneGrading).toBe('Done');
      expect(activityTracker.formativeTwoGrading).toBe('Pending');
    });

    test('should find activity trackers by allocation', async () => {
      await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 5,
        attendance: [true, true, false]
      });

      await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 6,
        attendance: [false, true, true]
      });

      const trackers = await ActivityTracker.findAll({
        where: { allocationId: courseOffering.id }
      });

      expect(trackers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Unique Constraints', () => {
    test('should enforce unique constraint on allocationId and weekNumber', async () => {
      await ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 7,
        attendance: [true, false, true]
      });

      await expect(ActivityTracker.create({
        allocationId: courseOffering.id,
        weekNumber: 7,
        attendance: [false, true, false]
      })).rejects.toThrow();
    });
  });
});