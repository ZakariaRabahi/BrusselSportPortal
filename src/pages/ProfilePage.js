import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [profilePicture, setProfilePicture] = useState(''); // State to store profile picture URL
  const [address, setAddress] = useState(''); // State to store address
  const [phoneNumber, setPhoneNumber] = useState(''); // State to store phone number
  const [description, setDescription] = useState(''); // State to store description
  const [profilePictureFile, setProfilePictureFile] = useState(null); // State to store selected profile picture file
  const navigate = useNavigate(); // Hook for navigation

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/users/me');
        localStorage.setItem('user', response.data.username); // Store username in local storage
        localStorage.setItem('user-description', response.data.description); // Store description in local storage
        setUser(response.data); // Set user data
        setProfilePicture(response.data.profilePicture); // Set profile picture
        setAddress(response.data.address); // Set address
        setPhoneNumber(response.data.phoneNumber); // Set phone number
        setDescription(response.data.description); // Set description
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login'); // Navigate to login page if user is not authenticated
        } else {
          console.error('Error fetching profile:', error.message);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle saving the updated profile data
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePictureFile); // Append profile picture file
      formData.append('address', address); // Append address
      formData.append('phoneNumber', phoneNumber); // Append phone number
      formData.append('description', description); // Append description
      localStorage.setItem('user-description', description); // Update description in local storage

      const response = await axios.put('/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data); // Update user data with response
      setProfilePicture(response.data.profilePicture); // Update profile picture
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  if (!user) return <div>Loading...</div>; // Show loading message if user data is not loaded

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={profilePicture ? `http://localhost:5000${profilePicture}` : 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-picture"
          />
          <h2>{user.username}</h2>
        </div>
        {isEditing ? (
          <div className="profile-edit">
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                onChange={(e) => {
                  setProfilePictureFile(e.target.files[0]);
                  setProfilePicture(URL.createObjectURL(e.target.files[0])); // Preview the selected profile picture
                }}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="profile-buttons">
              <button onClick={handleSave} className="btn btn-save">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn btn-cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            <p><strong>Description:</strong> {user.description}</p>
            <button onClick={() => setIsEditing(true)} className="btn btn-edit">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
