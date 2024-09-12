import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, ListGroup, Image } from 'react-bootstrap';

const EditEventPage = () => {
  // Extract eventId from the URL parameters
  const { eventId } = useParams();
  // State for event data, users, loading status
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch event and users data when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fetch event details from the API
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        // Fetch users who joined the event from the API
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchEvent();
    fetchUsers();
  }, [eventId]);

  // Handle input changes and update event state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  // Handle form submission to update the event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}`, event);
      navigate('/MyEventPage');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Display a loading message while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h1>Edit Event</h1>
      {/* Form to edit event details */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={new Date(event.date).toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="time">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={event.time}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={event.location}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={event.category}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>

      {/* Display list of users who joined the event */}
      <h2 className="mt-4">Users Joined</h2>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.username}>
            {/* Display user profile picture, username, and email */}
            <Image src={user.profilePicture} roundedCircle width="30" height="30" />{' '}
            {user.username} - {user.email}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default EditEventPage;
