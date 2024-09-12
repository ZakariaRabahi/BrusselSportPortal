const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Comments',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  timestamps: true,
});

Comment.associate = models => {
  Comment.belongsTo(models.User, { foreignKey: 'username' });
  Comment.belongsTo(models.Event, { foreignKey: 'eventId' });
  Comment.hasMany(models.Comment, { as: 'Replies', foreignKey: 'parentId' });
};

module.exports = Comment;
