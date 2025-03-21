const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');

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
  id_categoria: {
    type: DataTypes.INTEGER,
    references: {
      model: Categoria,
      key: 'id_categoria',
    },
    onDelete: 'SET NULL',
  },
  NombreNegocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Ubicacion: DataTypes.STRING,
  Especialidades: DataTypes.TEXT,
  PortafolioURL: DataTypes.STRING,
  imagen_url: DataTypes.STRING,
}, {
  tableName: 'repostero',
});

module.exports = Repostero;
