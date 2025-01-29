const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Repostero = require('./Repostero');
const Pastel =require ('./Pastel');

const PastelPersonalizado = sequelize.define('PastelPersonalizado', {
  id_pastelPersonalizado: {
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
  id_repostero: {
    type: DataTypes.INTEGER,
    references: {
      model: Repostero,
      key: 'id_repostero',
    },
    onDelete: 'CASCADE',
  },
  Bizcocho: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Relleno: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Decoraciones: DataTypes.TEXT,
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  FechaDiseño: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pastelPersonalizados',
});

module.exports = PastelPersonalizado;
