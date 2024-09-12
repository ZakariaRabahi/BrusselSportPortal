import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../css/NavigationBar.css';

const NavigationBar = ({ isAuthenticated, setAuth }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    localStorage.removeItem('user');
    localStorage.removeItem('user-description');
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="navbar-brand-custom">
          Brussels Sports Events
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" exact className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Events
                </Nav.Link>

                <Nav.Link as={NavLink} to="/MyEventPage" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  My events
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Contact
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Profile
                </Nav.Link>
                <Nav.Link as={NavLink} to="/" onClick={handleLogout} className="nav-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Register
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Contact
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
