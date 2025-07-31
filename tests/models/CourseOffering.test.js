const { CourseOffering, Module, Class, Cohort, Facilitator, Mode } = require('../../models');
const sequelize = require('../../config/database');

describe('CourseOffering Model', () => {
  let module, classEntity, cohort, facilitator, mode;

  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });

    // Create test data for foreign key relationships
    module = await Module.create({
      code: 'TEST101',
      name: 'Test Module',
      description: 'Test module for course offering',
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Model Creation', () => {
    test('should create a course offering with valid data', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      });

      expect(courseOffering).toBeDefined();
      expect(courseOffering.moduleId).toBe(module.id);
      expect(courseOffering.classId).toBe(classEntity.id);
      expect(courseOffering.cohortId).toBe(cohort.id);
      expect(courseOffering.facilitatorId).toBe(facilitator.id);
      expect(courseOffering.modeId).toBe(mode.id);
      expect(courseOffering.trimester).toBe('S1');
      expect(courseOffering.intakePeriod).toBe('HT1');
      expect(courseOffering.year).toBe(2024);
      expect(courseOffering.isActive).toBe(true); // Default value
    });

    test('should create a course offering with explicit isActive value', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S2',
        intakePeriod: 'HT2',
        year: 2024,
        isActive: false
      });

      expect(courseOffering.isActive).toBe(false);
    });
  });

  describe('Model Validation', () => {
    test('should fail validation without required moduleId', async () => {
      await expect(CourseOffering.create({
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation without required classId', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation without required cohortId', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation without required facilitatorId', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation without required modeId', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation with invalid trimester enum', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'INVALID',
        intakePeriod: 'HT1',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation with invalid intakePeriod enum', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'INVALID',
        year: 2024
      })).rejects.toThrow();
    });

    test('should fail validation with invalid year', async () => {
      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 1999 // Below minimum year 2000
      })).rejects.toThrow();
    });
  });

  describe('Unique Constraints', () => {
    test('should enforce unique constraint on module, class, cohort, and intakePeriod combination', async () => {
      await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'FT',
        year: 2024
      });

      await expect(CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'FT',
        year: 2024
      })).rejects.toThrow();
    });
  });

  describe('Model Associations', () => {
    test('should belong to Module', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2025
      });

      const offeringWithModule = await CourseOffering.findByPk(courseOffering.id, {
        include: [{ model: Module, as: 'module' }]
      });

      expect(offeringWithModule.module).toBeDefined();
      expect(offeringWithModule.module.id).toBe(module.id);
      expect(offeringWithModule.module.code).toBe('TEST101');
    });

    test('should belong to Class', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S2',
        intakePeriod: 'HT1',
        year: 2025
      });

      const offeringWithClass = await CourseOffering.findByPk(courseOffering.id, {
        include: [{ model: Class, as: 'class' }]
      });

      expect(offeringWithClass.class).toBeDefined();
      expect(offeringWithClass.class.id).toBe(classEntity.id);
      expect(offeringWithClass.class.name).toBe('2024S');
    });

    test('should belong to Cohort', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT2',
        year: 2025
      });

      const offeringWithCohort = await CourseOffering.findByPk(courseOffering.id, {
        include: [{ model: Cohort, as: 'cohort' }]
      });

      expect(offeringWithCohort.cohort).toBeDefined();
      expect(offeringWithCohort.cohort.id).toBe(cohort.id);
      expect(offeringWithCohort.cohort.name).toBe('cohort1');
    });

    test('should belong to Facilitator', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S2',
        intakePeriod: 'HT2',
        year: 2025
      });

      const offeringWithFacilitator = await CourseOffering.findByPk(courseOffering.id, {
        include: [{ model: Facilitator, as: 'facilitator' }]
      });

      expect(offeringWithFacilitator.facilitator).toBeDefined();
      expect(offeringWithFacilitator.facilitator.id).toBe(facilitator.id);
      expect(offeringWithFacilitator.facilitator.email).toBe('test.facilitator@example.com');
    });

    test('should belong to Mode', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'FT',
        year: 2025
      });

      const offeringWithMode = await CourseOffering.findByPk(courseOffering.id, {
        include: [{ model: Mode, as: 'mode' }]
      });

      expect(offeringWithMode.mode).toBeDefined();
      expect(offeringWithMode.mode.id).toBe(mode.id);
      expect(offeringWithMode.mode.name).toBe('online');
    });
  });

  describe('Model Methods', () => {
    test('should update course offering fields', async () => {
      const courseOffering = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2026
      });

      await courseOffering.update({
        trimester: 'S2',
        intakePeriod: 'HT2',
        isActive: false
      });

      expect(courseOffering.trimester).toBe('S2');
      expect(courseOffering.intakePeriod).toBe('HT2');
      expect(courseOffering.isActive).toBe(false);
    });

    test('should find course offerings by facilitator', async () => {
      await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2027
      });

      const offerings = await CourseOffering.findAll({
        where: { facilitatorId: facilitator.id }
      });

      expect(offerings.length).toBeGreaterThanOrEqual(1);
      offerings.forEach(offering => {
        expect(offering.facilitatorId).toBe(facilitator.id);
      });
    });

    test('should find course offerings by year and trimester', async () => {
      await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        cohortId: cohort.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'S1',
        intakePeriod: 'HT1',
        year: 2028
      });

      const offerings = await CourseOffering.findAll({
        where: { 
          year: 2028,
          trimester: 'S1'
        }
      });

      expect(offerings.length).toBeGreaterThanOrEqual(1);
      offerings.forEach(offering => {
        expect(offering.year).toBe(2028);
        expect(offering.trimester).toBe('S1');
      });
    });
  });

  describe('Enum Values', () => {
    test('should handle all valid trimester enum values', async () => {
      const trimesters = ['S1', 'S2'];
      
      for (let i = 0; i < trimesters.length; i++) {
        const courseOffering = await CourseOffering.create({
          moduleId: module.id,
          classId: classEntity.id,
          cohortId: cohort.id,
          facilitatorId: facilitator.id,
          modeId: mode.id,
          trimester: trimesters[i],
          intakePeriod: 'HT1',
          year: 2030 + i
        });

        expect(courseOffering.trimester).toBe(trimesters[i]);
      }
    });

    test('should handle all valid intakePeriod enum values', async () => {
      const intakePeriods = ['HT1', 'HT2', 'FT'];
      
      for (let i = 0; i < intakePeriods.length; i++) {
        const courseOffering = await CourseOffering.create({
          moduleId: module.id,
          classId: classEntity.id,
          cohortId: cohort.id,
          facilitatorId: facilitator.id,
          modeId: mode.id,
          trimester: 'S1',
          intakePeriod: intakePeriods[i],
          year: 2040 + i
        });

        expect(courseOffering.intakePeriod).toBe(intakePeriods[i]);
      }
    });
  });
});