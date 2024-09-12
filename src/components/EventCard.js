import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleJoinEvent = () => {
    console.log(event.id);
    navigate(`/event/${event.id}`);
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
        <Button variant="primary" onClick={handleJoinEvent} className="event-join-button">
          Join Event
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
