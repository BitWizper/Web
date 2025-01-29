const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Repostero = require('./Repostero');

const Cita = sequelize.define('Cita', {
  id_cita: {
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
  fecha_cita: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Confirmada', 'Cancelada'),
    defaultValue: 'Pendiente',
  },
}, {
  tableName: 'cita',
});

module.exports = Cita;
