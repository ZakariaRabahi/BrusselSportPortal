import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';
import JoinedEventCard from '../components/JoinedEventCard'; // Import JoinedEventCard
import OrganizerEventCard from '../components/OrganizerEventCard'; // Import OrganizerEventCard
import '../css/EventListPage.css';
import '../css/MyEventsPage.css';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]); // State to store all events
  const [joinedEvents, setJoinedEvents] = useState([]); // State to store joined events
  const [loading, setLoading] = useState(true); // State to manage loading status
  const username = localStorage.getItem('user'); // Get the username from local storage

  // Function to fetch events and joined events
  const fetchEvents = async () => {
    try {
      // Fetch all events
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
      // Fetch events the user has joined
      const joinedResponse = await axios.get(`http://localhost:5000/api/users/${username}/events`);
      setJoinedEvents(joinedResponse.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when the component mounts or when the username changes
  useEffect(() => {
    fetchEvents();
  }, [username]);

  // Filter events organized by the logged-in user
  const hostedEvents = events.filter(event => event.organizer === username);

  // Show loading message if events are still being fetched
  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="event-list-page">
      <h1 className="text-center my-4">My Events</h1>
      <Tabs defaultActiveKey="hosted" id="my-events-tabs" className="mb-3">
        {/* Tab for hosted events */}
        <Tab eventKey="hosted" title="Hosted Events">
          {hostedEvents.length === 0 ? (
            <p>No events found for the user {username}.</p>
          ) : (
            hostedEvents.map(event => (
              <OrganizerEventCard key={event.id} event={event} refreshEvents={fetchEvents} /> // Pass fetchEvents as refreshEvents prop
            ))
          )}
        </Tab>
        {/* Tab for joined events */}
        <Tab eventKey="joined" title="Joined Events">
          {joinedEvents.length === 0 ? (
            <p>No joined events found for the user {username}.</p>
          ) : (
            joinedEvents.map(event => (
              <JoinedEventCard key={event.id} event={event} refreshEvents={fetchEvents} /> // Pass fetchEvents as refreshEvents prop
            ))
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default MyEventsPage;
