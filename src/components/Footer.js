import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled contact-info">
              <li>Email: info@brusselssportsevents.com</li>
              <li>Phone: +32 123 456 789</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              Brussels Sports Events is your go-to portal for the latest sports events happening in Brussels.
              Join us and stay updated with the latest events, news, and activities.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="list-unstyled social-icons">
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-3 rights-reserved">
          <span>© 2024 Brussels Sports Events. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
