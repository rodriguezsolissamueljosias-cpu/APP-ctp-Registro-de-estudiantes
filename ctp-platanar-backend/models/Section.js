const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Section = sequelize.define('Section', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Section;
