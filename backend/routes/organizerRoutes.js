// Import the express library
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the Organizer model (assuming you have it defined in your models folder)
const Organizer = require('../models/Organizer');

// Route to fetch an organizer or create one if it doesn't exist
router.post('/newOrganizer', async (req, res) => {
  // Extract name and description from the request body
  const { name, description } = req.body;

  try {
    // Check if an organizer with the given name already exists
    let organizer = await Organizer.findOne({ where: { name } });

    // If the organizer doesn't exist, create a new one
    if (!organizer) {
      organizer = await Organizer.create({ name, description });
    }

    // Send a response with status 201 (created) and the organizer data
    res.status(201).json(organizer);
  } catch (error) {
    // If there's an error, send a response with status 500 (internal server error)
    res.status(500).json({ message: 'Error creating organizer', error: error.message });
  }
});

// Export the router so it can be used in other parts of the application
module.exports = router;

// Route to fetch an organizer by name
router.get('/:organizerName', async (req, res) => {
  try {
    // Find an organizer with the given name from the request parameters
    const organizer = await Organizer.findOne({ where: { name: req.params.organizerName } });

    // If the organizer doesn't exist, send a response with status 404 (not found)
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Send a response with the organizer data
    res.json(organizer);
  } catch (error) {
    // If there's an error, send a response with status 500 (internal server error)
    res.status(500).json({ message: 'Error fetching organizer', error: error.message });
  }
});

// Export the router so it can be used in other parts of the application
module.exports = router;
