import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const username = localStorage.getItem('user');
const userdescription = localStorage.getItem('user-description');

const CreateEventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sportsCategories = [
    'Soccer', 'Basketball', 'Tennis', 'Baseball', 'Cricket', 'Rugby',
    'Hockey', 'Volleyball', 'Table Tennis', 'Badminton', 'Golf', 'Swimming',
    'Athletics', 'Boxing', 'Wrestling', 'Martial Arts', 'Gymnastics', 'Cycling'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setOrganizer(username);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  const validateAddress = async (address) => {
    const apiKey = 'AIzaSyBJyyGKgXQs5uGxp3RK10nh2yA_UmmRJzE'; 
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === 'OK') {
        const result = response.data.results[0];
        const addressComponents = result.address_components;
  
        const postalCode = addressComponents.find(component => component.types.includes('postal_code'));
  
        const validPostalCodes = [
          '1000', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1081', '1082', '1083', '1090',
          '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190'
        ];
  
        if (postalCode && validPostalCodes.includes(postalCode.short_name)) {
          return true; // Address is valid and within Brussels
        }
      }
      return false; // Address is invalid or not within Brussels
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the address before submitting
    const isValidAddress = await validateAddress(location);
    if (!isValidAddress) {
      setError('Please enter a valid address. We only accept adresses in Brussels');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/events/create', {
        title,
        description,
        date,
        time,
        location,
        organizer,
        category
      });

      await axios.post('http://localhost:5000/api/organizers/newOrganizer', {
        name: username,
        description: userdescription
      });

      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Error creating event. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Create Event</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {sportsCategories.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
