const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organizer = sequelize.define('Organizer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

module.exports = Organizer;
