// components/Layout.jsx - Application shell with responsive navigation and consistent page structure

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../stylesheets/home-page.css";

/**
 * Layout - Application shell component implementing responsive navigation pattern
 * Provides consistent structure across all routes with hamburger menu for mobile
 * Manages global navigation state and handles route transitions with menu cleanup
 */
const Layout = () => {
  // Mobile menu visibility state - controls hamburger menu expansion
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // React Router navigation hook for SPA routing without page refreshes
  const navigate = useNavigate();

  /**
   * Mobile menu toggle handler - simple boolean inversion for menu state
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  /**
   * Centralized navigation handler with mobile UX optimization
   * Combines route navigation with menu state cleanup for seamless mobile experience
   * Prevents menu from staying open after navigation on mobile devices
   */
  const handleNavLinkClick = (path) => {
    navigate(path);
    // Essential mobile UX: Close menu after navigation to prevent overlay persistence
    setIsMenuOpen(false);
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        {/* Logo doubles as home navigation - common UX pattern */}
        <a href="#" className="navbar-logo" onClick={() => handleNavLinkClick("/")}>
          Fuel & Fire
        </a>

        {/* Hamburger menu implementation - three-bar animated icon */}
        {/* Dynamic class application enables CSS-based animation states */}
        <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
        </div>

        {/* Desktop navigation - always visible on larger screens */}
        <ul className="nav-links">
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/aicaloriecalculator")}>Custom Food Selector</a></li>
        </ul>

        {/* Mobile navigation - conditionally visible overlay menu */}
        {/* Duplicate navigation structure for responsive design flexibility */}
        <ul className={`mobile-nav-links ${isMenuOpen ? "active" : ""}`}>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/aicaloriecalculator")}>Custom Food Selector</a></li>
        </ul>
      </nav>

      {/* React Router Outlet - renders current route component */}
      {/* Main content area where page-specific components are injected */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Global footer with legal disclaimer for health/fitness content */}
      {/* Important for liability protection with health-related calculations */}
      <footer className="homepage-footer">
        <p>&copy; 2025 Fuel & Fire. All rights reserved.</p>
        <p className="disclaimer-text">
          <span className="disclaimer-bold">Disclaimer:</span> Calorie and exercise values are approximate.
        </p>
      </footer>
    </div>
  );
};

export default Layout;