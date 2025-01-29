const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Repostero = require('./Repostero');
const Categoria = require('./Categoria');

const Pastel = sequelize.define('Pastel', {
  id_pastel: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  popularidad: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  id_repostero: {
    type: DataTypes.INTEGER,
    references: {
      model: Repostero,
      key: 'id_repostero',
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
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser true si el campo es opcional
  },
}, {
  tableName: 'pastel',
});

module.exports = Pastel;
