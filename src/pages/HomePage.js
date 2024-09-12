import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventList from '../components/EventList';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
  const [events, setEvents] = useState([]); // State to store events
  const navigate = useNavigate(); // Hook for navigation

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        console.log('API Response:', response.data);  
        setEvents(response.data); // Set events state with the fetched data
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Handle navigation to events page
  const handleViewEvents = () => {
    navigate('/events');
  };

  return (
    <div className="home-page">
      <header className="banner text-white text-center py-5">
        <Container>
          <h1>Welcome to Brussels Sports Events</h1>
          <p>Your go-to portal for all sports events happening in Brussels.</p>
          <Button className='link-button' variant="primary" size="lg" onClick={handleViewEvents}>
            View Events
          </Button>
        </Container>
      </header>
      
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <h2>Upcoming Events</h2>
            <EventList events={events.slice(0, 3)} /> {/* Display first 3 events */}
            <div className="text-center mt-2">
              <Button variant="link" onClick={handleViewEvents}>See More</Button>
            </div>
          </Col>
          <Col md={4}>
            <h2>About Us</h2>
            <Card className="mb-4">
              <Card.Body>
                <Card.Text>
                  Brussels Sports Events is dedicated to bringing you the latest and greatest in sports events happening around Brussels. Whether you're into marathons, soccer, basketball, or any other sport, you'll find it all here!
                </Card.Text>
              </Card.Body>
            </Card>
            
            <h2>Gallery</h2>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Exciting Marathons</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1790&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Second slide"
                />
                <Carousel.Caption>
                  <h3>Energetic Basketball</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://plus.unsplash.com/premium_photo-1685303469251-4ee0ea014bb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Third slide"
                />
                <Carousel.Caption>
                  <h3>Competitive Soccer</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
