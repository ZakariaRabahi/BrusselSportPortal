import 'bootstrap/dist/css/bootstrap.min.css';
import './css/NavigationBar.css'; 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import NavigationBar from './components/NavigationBar';
import EventsPage from './pages/EventListPage';
import ProfilePage from './pages/ProfilePage.js'; 
import OrganizerPage from './pages/OrganizerPage';
import CreateEventPage from './pages/CreateEventPage'; 
import MyEventPage from './pages/MyEventsPage'; 
import EventPage from './pages/EventPage';
import EditEventPage from './pages/EditEventPage';
import Footer from './components/Footer';
import './App.css';
import './common.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to update authentication status
  const setAuth = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <Router>
      <div className="app-container">
        <NavigationBar isAuthenticated={isAuthenticated} setAuth={setAuth} /> {/* Navigation bar with authentication status */}
        <div className="content-container">
          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/events" element={isAuthenticated ? <EventsPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/organizer/:organizerName" element={<OrganizerPage />} />
              <Route path="/create-event" element={isAuthenticated ? <CreateEventPage /> : <Navigate to="/login" />} />
              <Route path="/MyEventPage" element={isAuthenticated ? <MyEventPage /> : <Navigate to="/login" />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="/edit-event/:eventId" element={<EditEventPage />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
