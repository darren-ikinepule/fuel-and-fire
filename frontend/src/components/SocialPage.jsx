// SocialPage.jsx - Brand social media hub with accessibility and performance optimizations

import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import '../stylesheets/social-page.css';

/**
 * SocialPage - Centralized social media landing page component
 * Implements accessibility best practices, security measures, and performance optimizations
 * Serves as a brand hub directing users to external social platforms
 */
const SocialPage = () => {
  return (
    <div className="social-page-container">
      <div className="social-card">
        <img
          src="/images/fuel-fire-logo.jpeg"
          alt="Fuel & Fire Logo"
          // Lazy loading optimization: Defers image loading until needed, improving initial page performance
          loading="lazy"
          className="social-logo"
        />
        <p className="social-tagline">Fast Food Burner</p>
        <div className="social-icons">
          {/* Security implementation: target="_blank" with rel="noopener noreferrer" */}
          {/* Prevents window.opener exploitation and referrer information leakage */}
          <a
            href="https://facebook.com/fuelandfire"
            target="_blank"
            rel="noopener noreferrer"
            // Accessibility: Provides context for screen readers when visual icons aren't descriptive
            aria-label="Fuel & Fire on Facebook"
            // Enhanced UX: Tooltip for mouse users while maintaining accessibility
            title="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com/fuelandfire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fuel & Fire on Instagram"
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/fuelandfire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fuel & Fire on Twitter"
            title="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com/fuelandfire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fuel & Fire on YouTube"
            title="YouTube"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;