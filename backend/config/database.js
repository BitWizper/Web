const { Sequelize } = require('sequelize'); 
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,      // Agrega esta línea si necesitas el puerto
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = sequelize;
