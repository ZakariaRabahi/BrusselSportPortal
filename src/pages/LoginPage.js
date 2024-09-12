import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

const LoginPage = ({ setAuth }) => {
  // State hooks for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      // Save the token in local storage
      localStorage.setItem('token', response.data.token);
      // Set authentication status to true
      setAuth(true);
      // Navigate to the profile page
      navigate('/profile');
    } catch (error) {
      // Set error message if login fails
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h1 className="text-center my-4">Login</h1>
        <form onSubmit={handleLogin}>
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
          {/* Display error message if login fails */}
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
