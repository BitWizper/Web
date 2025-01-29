const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Repostero = require ('./Repostero');
const Pastel = require('./Pastel');

const Resena = sequelize.define('Resena', {
  id_resena: {
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
  id_pastel: {
    type: DataTypes.INTEGER,
    references: {
      model: Pastel,
      key: 'id_pastel',
    },
    onDelete: 'CASCADE',
  },
  Comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Calificacion: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  FechaResena: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'resena',
});

module.exports = Resena;
