import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EventCard from './EventCard';

const EventList = ({ events }) => {
  if (!events.length) {
    return <p>No upcoming events.</p>;
  }

  return (
    <Container>
      <Row>
        {events.map((event) => (
          <Col key={event.id} xs={12}>
            <EventCard event={event} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EventList;
