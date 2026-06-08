const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Teacher = sequelize.define('Teacher', {
  teacherId: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Teacher;
