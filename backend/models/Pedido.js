// models/Pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Repostero = require('./Repostero');
const Pastel = require('./Pastel');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  id_pastel: {
    type: DataTypes.INTEGER,
    references: {
      model: Pastel,
      key: 'id_pastel',
    },
    onDelete: 'CASCADE',
  },
  direccion: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'pedidos',
});

module.exports = Pedido;
