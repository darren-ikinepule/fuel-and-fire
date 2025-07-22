import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import '../stylesheets/social-page.css';

const SocialPage = () => {
  return (
    <div className="social-page-container">
      <div className="social-card">
        <img
          src="/images/fuel-fire-logo.jpeg"
          alt="Fuel & Fire Logo"
          className="social-logo"
        />

        <p className="social-tagline">Fast Food Burner</p>

        <div className="social-icons">
          <a href="https://facebook.com/fuelandfire" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com/fuelandfire" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/fuelandfire" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://youtube.com/fuelandfire" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
