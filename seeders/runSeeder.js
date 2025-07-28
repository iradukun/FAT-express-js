const sequelize = require('../config/database');
const seedDatabase = require('./seedDatabase');

const runSeeder = async () => {
  try {
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    // Run seeder
    await seedDatabase();
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();