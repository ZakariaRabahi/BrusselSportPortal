import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import '../css/EventPage.css';

const EventPage = () => {
  const { eventId } = useParams(); // Get the eventId from the URL parameters
  const [event, setEvent] = useState(null); // State for event details
  const [comments, setComments] = useState([]); // State for comments
  const [loading, setLoading] = useState(true); // State for loading status
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [replyCommentId, setReplyCommentId] = useState(null); // State for reply comment ID
  const navigate = useNavigate(); // Navigation hook
  const username = localStorage.getItem('user'); // Retrieve the username from local storage

  // Fetch event and comments data when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchEvent();
    fetchComments();
  }, [eventId]);

  // Handle joining the event
  const handleJoinEvent = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/join`,
        { username } 
      );
      alert(`Successfully joined the event: ${event.title}`);
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join the event. Please try again.');
    }
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/events/${eventId}/comments`,
        { username, content: newComment, parentId: replyCommentId }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      setReplyCommentId(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  // Handle clicking the reply button on a comment
  const handleReplyClick = (commentId) => {
    setReplyCommentId(commentId);
  };

  // Recursively render comments and their replies
  const renderComments = (comments, parentId = null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="comment-container">
          <div className="comment">
            <div className="comment-content">
              <p className="username">{comment.username || 'Unknown User'}:</p>
              <p className="content">{comment.content}</p>
              <span
                className="reply-button"
                onClick={() => handleReplyClick(comment.id)}
              >
                Reply
              </span>
            </div>
          </div>
          <div className="replies-container">
            {renderComments(comments, comment.id)}
          </div>
        </div>
      ));
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  // Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBJyyGKgXQs5uGxp3RK10nh2yA_UmmRJzE&q=${encodeURIComponent(event.location)}`;

  // Handle exporting event data
  const handleExport = () => {
    window.open(`http://localhost:5000/api/events/export/${eventId}`, '_blank');
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{event.title}</Card.Title>
              <Card.Subtitle className="eventCategory">{event.category}</Card.Subtitle>
              <Card.Text className="cardDescription">{event.description}</Card.Text>
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
                  <span onClick={() => navigate(`/organizer/${event.organizer}`)} className="organizer-link">
                    {event.organizer}
                  </span>
                </Col>
              </Row>
              <Button variant="primary" onClick={handleJoinEvent} className="event-join-button">
                Join Event
              </Button>
              <Button variant="secondary" onClick={handleExport} className="event-export-button">
                Export Event
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <div className="map-container">
            <iframe
              title="Event Location"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              src={mapUrl}
              allowFullScreen
            ></iframe>
          </div>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Comments</Card.Title>
          <hr />
          {comments.length > 0 ? (
            renderComments(comments)
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group controlId="newComment">
              <Form.Label>{replyCommentId ? 'Replying to comment' : 'Add a comment'}:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              {replyCommentId ? 'Post Reply' : 'Post Comment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventPage;
