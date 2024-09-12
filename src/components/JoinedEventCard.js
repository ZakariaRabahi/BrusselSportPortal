import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/EventCard.css';

const JoinedEventCard = ({ event, refreshEvents }) => {
  const navigate = useNavigate();

  const handleDeleteJoinEvent = async () => {
    const username = localStorage.getItem('user'); // Get the username from local storage

    try {
      const response = await axios.delete(`http://localhost:5000/api/events/${event.id}/join`, {
        data: { username }
      });
      console.log(response.data);
      refreshEvents(); // Call refreshEvents after deleting the joined event
    } catch (error) {
      console.error('Error deleting joined event:', error);
    }
  };

  const handleOrganizerClick = () => {
    navigate(`/organizer/${event.organizer}`);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{event.title}</Card.Title>
        <Card.Subtitle className='eventCategory'>{event.category}</Card.Subtitle>
        <Card.Text className='cardDescription'>{event.description}</Card.Text>
        <Row className="event-details-row">
          <Col className="event-detail">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </Col>
          <Col className="event-detail">
            <strong>Time:</strong> {event.time}
          </Col>
          <Col className="event-detail">
            <strong>Location:</strong> {event.location}
          </Col>
          <Col className="event-detail">
            <strong>Organizer:</strong> 
            <span onClick={handleOrganizerClick} className="organizer-link">
              {event.organizer}
            </span>
          </Col>
        </Row>
        <Button variant="danger" onClick={handleDeleteJoinEvent} className="event-join-button">
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default JoinedEventCard;
