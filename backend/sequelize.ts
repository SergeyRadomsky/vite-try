import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  port: 5432,
  host: 'localhost',
  dialect: 'postgres',
  database: 'new-test-store',
  username: 'postgres',
  password: 'postgres',
});

console.log('============sequelize============');
console.log(sequelize);
console.log('============sequelize============'); //Connection refused: no further information

