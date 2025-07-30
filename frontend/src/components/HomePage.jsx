
// HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/home-page.css";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (path) => {
    navigate(path);
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
