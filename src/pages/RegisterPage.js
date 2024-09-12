import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css'; // Import custom CSS

const RegisterPage = () => {
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook for navigation

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send registration request to the server
      await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      navigate('/login'); // Navigate to login page on successful registration
    } catch (error) {
      setError('Registration failed, please check your credentials'); // Set error message if registration fails
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h1 className="text-center my-4">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>} {/* Display error message if registration fails */}
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
