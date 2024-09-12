const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');

const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');


require('./models/User');
require('./models/Event');
require('./models/UserEvent');
require('./models/Comment');


const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);


require('./models/associations');

async function modifyDatabaseSchema() {
  const dropForeignKey1 = 'ALTER TABLE UserEvents DROP FOREIGN KEY userevents_ibfk_1;';
  const dropForeignKey2 = 'ALTER TABLE UserEvents DROP FOREIGN KEY userevents_ibfk_2;';
  const modifyColumn = 'ALTER TABLE UserEvents MODIFY COLUMN username VARCHAR(255) NOT NULL;';
  const addForeignKey1 = 'ALTER TABLE UserEvents ADD CONSTRAINT userevents_ibfk_1 FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE ON UPDATE CASCADE;';
  const addForeignKey2 = 'ALTER TABLE UserEvents ADD CONSTRAINT userevents_ibfk_2 FOREIGN KEY (eventId) REFERENCES Events(id) ON DELETE CASCADE ON UPDATE CASCADE;';

  try {
    await sequelize.query(dropForeignKey1);
    await sequelize.query(dropForeignKey2);
    await sequelize.query(modifyColumn);
    await sequelize.query(addForeignKey1);
    await sequelize.query(addForeignKey2);
    console.log('Database schema modified successfully.');
  } catch (error) {
    console.error('Error modifying database schema:', error);
  }
}

// Sync database and modify schema
sequelize.sync({ alter: true})
  .then(() => {
    console.log('Database synchronized');
    return modifyDatabaseSchema();
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));