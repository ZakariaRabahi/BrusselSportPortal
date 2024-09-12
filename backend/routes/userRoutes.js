// Import required libraries and modules
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Event = require('../models/Event');
const UserEvent = require('../models/UserEvent');
const auth = require('../middleware/auth');
require('dotenv').config();

// Create a new router object
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile_pictures';
    // Create the upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route for user registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  // Hash the user's password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Create a new user with the provided details
    const user = await User.create({ username, email, passwordHash });
    // Send a 201 status code and the created user
    res.status(201).json(user);
  } catch (error) {
    // Send a 400 status code if there's an error
    res.status(400).json({ error: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Send a 401 status code if the email is invalid
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored password hash
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      // Send a 401 status code if the password is invalid
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Route to get logged-in user's information
router.get('/me', auth, async (req, res) => {
  try {
    // Find the user by ID and select specific attributes
    const user = await User.findByPk(req.userId, {
      attributes: ['username', 'email', 'profilePicture', 'address', 'phoneNumber', 'description']
    });

    if (!user) {
      // Send a 404 status code if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error retrieving user information', error: error.message });
  }
});

// Route to update logged-in user's information
router.put('/me', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const { address, phoneNumber, description } = req.body;
    // Find the user by ID
    const user = await User.findByPk(req.userId);

    if (!user) {
      // Send a 404 status code if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile picture if a file is uploaded
    if (req.file) {
      user.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
    }
    // Update the user's other details
    user.address = address;
    user.phoneNumber = phoneNumber;
    user.description = description;

    // Save the updated user
    await user.save();
    res.json(user);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: 'Error updating user information', error: error.message });
  }
});

// Route to fetch events joined by a specific user
router.get('/:username/events', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      // Send a 404 status code if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all events the user has joined
    const joinedEvents = await UserEvent.findAll({
      where: { username },
      include: [Event],
    });

    // Extract the events from the joinedEvents records
    const events = joinedEvents.map(joinedEvent => joinedEvent.Event);

    res.json(events);
  } catch (error) {
    // Send a 500 status code if there's an error
    res.status(500).json({ message: error.message });
  }
});

// Export the router so it can be used in other parts of the application
module.exports = router;
