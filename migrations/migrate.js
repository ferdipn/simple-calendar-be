import { Sequelize } from 'sequelize';
import sequelize from '../config/config.js';
import { up as createUsersTable } from './20240712173824-create_users_table.js';
import { up as createEventsTable } from './20240712180921-create_events_table.js';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const queryInterface = sequelize.getQueryInterface();

    await createUsersTable(queryInterface, Sequelize);
    await createEventsTable(queryInterface, Sequelize);

    console.log('Migration has been applied successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

migrate();