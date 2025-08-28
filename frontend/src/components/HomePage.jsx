// HomePage.jsx - Landing page component with navigation state management

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/home-page.css";

/**
 * HomePage - Application landing page with navigation integration
 * Serves as the entry point for the Fuel & Fire app experience
 * Manages mobile menu state and handles programmatic navigation
 */
const HomePage = () => {
  // Mobile menu toggle state - prepared for responsive navigation implementation
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // React Router hook for programmatic navigation without page refreshes
  const navigate = useNavigate();

  /**
   * Toggle mobile menu visibility
   * Currently prepared for mobile navigation implementation
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Handles navigation with menu cleanup
   * Combines route navigation with UI state management for better UX
   * Ensures mobile menu closes after navigation to prevent UI confusion
   */
  const handleNavLinkClick = (path) => {
    navigate(path);
    // Close mobile menu after navigation to reset UI state
    setIsMenuOpen(false);
  };

  return (
    <div className="homepage-container">
      <img
        src="/images/fuel-fire-logo.jpeg"
        alt="Fuel & Fire Logo"
        className="social-logo"
      />
     
      <div className="homepage-content">
        <h2 className="homepage-heading">
          Balance Your Indulgence with Activity.
        </h2>
        <p className="homepage-subheading">
          Fuel & Fire helps you understand the exercise equivalents of your
          favorite foods...
        </p>
        {/* Primary CTA - uses handleNavLinkClick for consistent navigation behavior */}
        <button
          className="homepage-cta-button"
          onClick={() => handleNavLinkClick("/intro")}
        >
          Start Balancing Now
        </button>
      </div>

      
    </div>
  );
};

export default HomePage;