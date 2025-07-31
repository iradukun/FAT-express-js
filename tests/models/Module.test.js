const { Module } = require('../../models');
const sequelize = require('../../config/database');

describe('Module Model', () => {
  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Model Creation', () => {
    test('should create a module with valid data', async () => {
      const module = await Module.create({
        code: 'CS101',
        name: 'Introduction to Computer Science',
        description: 'Basic concepts of computer science',
        credits: 3,
        level: 'undergraduate'
      });

      expect(module).toBeDefined();
      expect(module.code).toBe('CS101');
      expect(module.name).toBe('Introduction to Computer Science');
      expect(module.description).toBe('Basic concepts of computer science');
      expect(module.credits).toBe(3);
      expect(module.level).toBe('undergraduate');
      expect(module.isActive).toBe(true); // Default value
    });

    test('should create a module with default isActive value', async () => {
      const module = await Module.create({
        code: 'CS102',
        name: 'Data Structures',
        description: 'Introduction to data structures',
        credits: 4,
        level: 'undergraduate'
      });

      expect(module.isActive).toBe(true);
    });

    test('should create a module with explicit isActive value', async () => {
      const module = await Module.create({
        code: 'CS103',
        name: 'Algorithms',
        description: 'Algorithm design and analysis',
        credits: 4,
        level: 'undergraduate',
        isActive: false
      });

      expect(module.isActive).toBe(false);
    });
  });

  describe('Model Validation', () => {
    test('should fail validation without required code', async () => {
      await expect(Module.create({
        name: 'Test Module',
        description: 'Test description',
        credits: 3,
        level: 'undergraduate'
      })).rejects.toThrow();
    });

    test('should fail validation without required name', async () => {
      await expect(Module.create({
        code: 'TEST101',
        description: 'Test description',
        credits: 3,
        level: 'undergraduate'
      })).rejects.toThrow();
    });

    test('should fail validation without required credits', async () => {
      await expect(Module.create({
        code: 'TEST102',
        name: 'Test Module',
        description: 'Test description',
        level: 'undergraduate'
      })).rejects.toThrow();
    });

    test('should fail validation without required level', async () => {
      await expect(Module.create({
        code: 'TEST103',
        name: 'Test Module',
        description: 'Test description',
        credits: 3
      })).rejects.toThrow();
    });

    test('should fail validation with invalid level enum', async () => {
      await expect(Module.create({
        code: 'TEST104',
        name: 'Test Module',
        description: 'Test description',
        credits: 3,
        level: 'invalid_level'
      })).rejects.toThrow();
    });

    test('should fail validation with negative credits', async () => {
      await expect(Module.create({
        code: 'TEST105',
        name: 'Test Module',
        description: 'Test description',
        credits: -1,
        level: 'undergraduate'
      })).rejects.toThrow();
    });

    test('should fail validation with zero credits', async () => {
      await expect(Module.create({
        code: 'TEST106',
        name: 'Test Module',
        description: 'Test description',
        credits: 0,
        level: 'undergraduate'
      })).rejects.toThrow();
    });
  });

  describe('Unique Constraints', () => {
    test('should enforce unique constraint on module code', async () => {
      await Module.create({
        code: 'UNIQUE101',
        name: 'First Module',
        description: 'First module description',
        credits: 3,
        level: 'undergraduate'
      });

      await expect(Module.create({
        code: 'UNIQUE101',
        name: 'Second Module',
        description: 'Second module description',
        credits: 4,
        level: 'postgraduate'
      })).rejects.toThrow();
    });
  });

  describe('Model Methods', () => {
    test('should update module fields', async () => {
      const module = await Module.create({
        code: 'UPDATE101',
        name: 'Original Name',
        description: 'Original description',
        credits: 3,
        level: 'undergraduate'
      });

      await module.update({
        name: 'Updated Name',
        description: 'Updated description',
        credits: 4,
        isActive: false
      });

      expect(module.name).toBe('Updated Name');
      expect(module.description).toBe('Updated description');
      expect(module.credits).toBe(4);
      expect(module.isActive).toBe(false);
    });

    test('should find modules by level', async () => {
      await Module.create({
        code: 'UG101',
        name: 'Undergraduate Module 1',
        description: 'UG module description',
        credits: 3,
        level: 'undergraduate'
      });

      await Module.create({
        code: 'PG101',
        name: 'Postgraduate Module 1',
        description: 'PG module description',
        credits: 4,
        level: 'postgraduate'
      });

      const undergraduateModules = await Module.findAll({
        where: { level: 'undergraduate' }
      });

      const postgraduateModules = await Module.findAll({
        where: { level: 'postgraduate' }
      });

      expect(undergraduateModules.length).toBeGreaterThanOrEqual(1);
      expect(postgraduateModules.length).toBeGreaterThanOrEqual(1);
      
      undergraduateModules.forEach(module => {
        expect(module.level).toBe('undergraduate');
      });

      postgraduateModules.forEach(module => {
        expect(module.level).toBe('postgraduate');
      });
    });

    test('should find active modules', async () => {
      await Module.create({
        code: 'ACTIVE101',
        name: 'Active Module',
        description: 'Active module description',
        credits: 3,
        level: 'undergraduate',
        isActive: true
      });

      await Module.create({
        code: 'INACTIVE101',
        name: 'Inactive Module',
        description: 'Inactive module description',
        credits: 3,
        level: 'undergraduate',
        isActive: false
      });

      const activeModules = await Module.findAll({
        where: { isActive: true }
      });

      const inactiveModules = await Module.findAll({
        where: { isActive: false }
      });

      expect(activeModules.length).toBeGreaterThanOrEqual(1);
      expect(inactiveModules.length).toBeGreaterThanOrEqual(1);

      activeModules.forEach(module => {
        expect(module.isActive).toBe(true);
      });

      inactiveModules.forEach(module => {
        expect(module.isActive).toBe(false);
      });
    });
  });

  describe('Data Types and Constraints', () => {
    test('should handle different credit values', async () => {
      const modules = await Promise.all([
        Module.create({
          code: 'CREDIT1',
          name: 'One Credit Module',
          description: 'Module with 1 credit',
          credits: 1,
          level: 'undergraduate'
        }),
        Module.create({
          code: 'CREDIT6',
          name: 'Six Credit Module',
          description: 'Module with 6 credits',
          credits: 6,
          level: 'postgraduate'
        })
      ]);

      expect(modules[0].credits).toBe(1);
      expect(modules[1].credits).toBe(6);
    });

    test('should handle all valid level enum values', async () => {
      const levels = ['undergraduate', 'postgraduate', 'diploma'];
      
      for (let i = 0; i < levels.length; i++) {
        const module = await Module.create({
          code: `LEVEL${i + 1}`,
          name: `${levels[i]} Module`,
          description: `Module for ${levels[i]} level`,
          credits: 3,
          level: levels[i]
        });

        expect(module.level).toBe(levels[i]);
      }
    });
  });
});