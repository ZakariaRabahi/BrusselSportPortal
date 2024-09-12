// Import the express library
const express = require('express');
// Create a new router object
const router = express.Router();
// Import Sequelize for ORM operations
const Sequelize = require('sequelize');
// Import models
const Event = require('../models/Event');
const User = require('../models/User');
const UserEvent = require('../models/UserEvent');
const Comment = require('../models/Comment');

// Route to fetch upcoming events
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    // Find all events that are on or after today, ordered by date ascending
    const events = await Event.findAll({
      where: {
        date: {
          [Sequelize.Op.gte]: today,
        },
      },
      order: [['date', 'ASC']],
    });
    res.json(events);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: error.message });
  }
});

// Route to get an event by its ID
router.get('/:eventId', async (req, res) => {
  try {
    // Find event by primary key (ID)
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      // Send a 404 status code if event is not found
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
});

// Route to create a new event
router.post('/create', async (req, res) => {
  const { title, description, date, time, location, organizer, category } = req.body;

  try {
    // Create a new event with the provided details
    const event = await Event.create({ title, description, date, time, location, organizer, category });
    // Send a 201 status code and the created event
    res.status(201).json(event);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: error.message });
  }
});

// Route to join an event
router.post('/:eventId/join', async (req, res) => {
  const { eventId } = req.params;
  const { username } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      // Send a 404 status code if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the event by ID
    const event = await Event.findByPk(eventId);
    if (!event) {
      // Send a 404 status code if event is not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user has already joined the event
    const userEvent = await UserEvent.findOne({ where: { username: user.username, eventId: event.id } });
    if (userEvent) {
      // Send a 400 status code if user has already joined the event
      return res.status(400).json({ message: 'User already joined this event' });
    }

    // Create a new UserEvent to join the user to the event
    await UserEvent.create({ username: user.username, eventId: event.id });

    // Send a 200 status code indicating success
    res.status(200).json({ message: 'Successfully joined the event' });
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error processing join event', error: error.message });
  }
});

// Route to delete an event by its ID
router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by primary key (ID)
    const event = await Event.findByPk(eventId);
    if (!event) {
      // Send a 404 status code if event is not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete the event
    await event.destroy();
    // Send a 200 status code indicating success
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: error.message });
  }
});

// Route to update an event by its ID
router.put('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, time, location, category } = req.body;

  try {
    // Find the event by primary key (ID)
    const event = await Event.findByPk(eventId);
    if (!event) {
      // Send a 404 status code if event is not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event details
    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.location = location;
    event.category = category;

    // Save the updated event
    await event.save();
    // Send a 200 status code and the updated event
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// Route to delete a user's joined event
router.delete('/:eventId/join', async (req, res) => {
  const { eventId } = req.params;
  const { username } = req.body;

  try {
    // Find the UserEvent record by eventId and username
    const userEvent = await UserEvent.findOne({ where: { eventId, username } });
    if (!userEvent) {
      // Send a 404 status code if the user is not joined in this event
      return res.status(404).json({ message: 'User not joined in this event' });
    }

    // Delete the UserEvent record
    await userEvent.destroy();
    // Send a 200 status code indicating success
    res.status(200).json({ message: 'Successfully removed from the event' });
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error deleting joined event', error: error.message });
  }
});

// Route to fetch comments for a specific event
router.get('/:eventId/comments', async (req, res) => {
  try {
    // Find all comments for the given eventId
    const comments = await Comment.findAll({
      where: { eventId: req.params.eventId },
      attributes: ['id', 'username', 'content', 'parentId'] // Only fetch required fields
    });
    res.json(comments);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Route to add a comment or reply to an event
router.post('/:eventId/comments', async (req, res) => {
  const { eventId } = req.params;
  const { username, content, parentId } = req.body;

  try {
    // Create a new comment with the provided details
    const comment = await Comment.create({ eventId, username, content, parentId });
    // Send a 201 status code and the created comment
    res.status(201).json(comment);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Route to fetch users for a specific event
router.get('/:eventId/users', async (req, res) => {
  try {
    // Find all UserEvent records for the given eventId and include user details
    const users = await UserEvent.findAll({
      where: { eventId: req.params.eventId },
      include: [{
        model: User,
        attributes: ['username', 'email', 'profilePicture']
      }]
    });
    res.json(users);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error fetching users for event', error: error.message });
  }
});

// Endpoint to fetch event data for third-party consumption
router.get('/export/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by primary key (ID)
    const event = await Event.findByPk(eventId);
    if (!event) {
      // Send a 404 status code if event is not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Send the event data as JSON
    res.json(event);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error fetching event data', error: error.message });
  }
});

// Export the router so it can be used in other parts of the application
module.exports = router;
