const User = require('./User');
const Event = require('./Event');
const UserEvent = require('./UserEvent');


User.belongsToMany(Event, { through: UserEvent, foreignKey: 'username' });
Event.belongsToMany(User, { through: UserEvent, foreignKey: 'eventId' });

Event.hasMany(UserEvent, { foreignKey: 'eventId' });
UserEvent.belongsTo(Event, { foreignKey: 'eventId' });

User.hasMany(UserEvent, { foreignKey: 'username' });
UserEvent.belongsTo(User, { foreignKey: 'username' });

