const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Repostero = sequelize.define('Repostero', {
  id_repostero: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
    onDelete: 'CASCADE',
  },
  NombreNegocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Ubicacion: DataTypes.STRING,
  Especialidades: DataTypes.TEXT,
  PortafolioURL: DataTypes.STRING,
}, {
  tableName: 'repostero',
});

module.exports = Repostero;
