import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCard from '../components/EventCard';
import '../css/EventListPage.css';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);

        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(event => event.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [location]); // Add location as a dependency to re-fetch events on navigation

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const filteredEvents = events.filter(event => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === '' || event.category === category)
    );
  });

  return (
    <div className="event-list-page">
      <h1 className="text-center my-4">Events</h1>
      <div className="search-filter-container mb-4">
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
        />
        <select value={category} onChange={handleCategoryChange} className="form-select mt-2">
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={() => navigate('/create-event')} className="btn btn-primary mt-3">
          Create New Event
        </button>
      </div>
      {filteredEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventListPage;
