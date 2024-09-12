const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserEvent = sequelize.define('UserEvent', {
  username: {
    type: DataTypes.STRING,
    references: {
      model: 'Users',
      key: 'username',
    },
    allowNull: false,
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.STRING,
    references: {
      model: 'Events',
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
  },
}, {
  timestamps: true,
});

module.exports = UserEvent;
