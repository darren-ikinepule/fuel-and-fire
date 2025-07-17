// components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../stylesheets/home-page.css"; // Assuming your navbar styles are in here

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        <a href="#" className="navbar-logo" onClick={() => handleNavLinkClick("/")}>
          Fuel & Fire
        </a>

        <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
        </div>

        <ul className="nav-links">
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
        </ul>

        <ul className={`mobile-nav-links ${isMenuOpen ? "active" : ""}`}>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

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
