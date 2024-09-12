import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import EventCard from '../components/EventCard';
import '../css/EventListPage.css';

const OrganizerPage = () => {
  const { organizerName } = useParams(); // Get the organizer name from the URL parameters
  const [organizer, setOrganizer] = useState(null); // State to store organizer details
  const [events, setEvents] = useState([]); // State to store events organized by the organizer
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    // Function to fetch organizer details
    const fetchOrganizer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/organizers/${organizerName}`);
        setOrganizer(response.data);
      } catch (error) {
        console.error('Error fetching organizer:', error);
      }
    };

    // Function to fetch events organized by the organizer
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        const filteredEvents = response.data.filter(event => event.organizer === organizerName);
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false); // Set loading to false once data fetching is complete
      }
    };

    fetchOrganizer();
    fetchEvents();
  }, [organizerName]);

  // Display loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="event-list-page">
      {organizer && (
        <>
          <h1 className="text-center my-4">{organizer.name}</h1>
          <Card>
            <Card.Body>
              <Card.Title>About {organizer.name}</Card.Title>
              <Card.Text>{organizer.description}</Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
      <h2 className="text-center my-4">Events Organized by {organizerName}</h2>
      {events.length === 0 ? (
        <p>No events found for this organizer.</p>
      ) : (
        <Row>
          {events.map(event => (
            <Col key={event.id} sm={12} md={6} lg={4} className="mb-4">
              <EventCard event={event} /> {/* Render EventCard component for each event */}
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrganizerPage;
