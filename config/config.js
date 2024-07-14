import { Sequelize } from 'sequelize';

const db = new Sequelize('abba-test', 'ferdipn', 'pasport', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  logging: msg => console.log(msg), 

});

export default db;
