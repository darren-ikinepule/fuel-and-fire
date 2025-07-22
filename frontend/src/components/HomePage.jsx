// // HomePage.jsx
// import React, { useState } from 'react';
// import '../stylesheets/home-page.css'; // Import HomePage specific CSS

// const HomePage = ({ onNavigate }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleNavLinkClick = (page) => {
//     onNavigate(page);
//     setIsMenuOpen(false); // Close menu after clicking a link
//   };

//   return (
//     <div className="homepage-container">
//       {/* Navigation Bar */}
//       <nav className="navbar">
//         <a href="#" className="navbar-logo" onClick={() => handleNavLinkClick('home')}>
//           Fuel & Fire
//         </a>

//         {/* Hamburger Menu Icon */}
//         <div
//           className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//         >
//           <div className="hamburger-bar"></div>
//           <div className="hamburger-bar"></div>
//           <div className="hamburger-bar"></div>
//         </div>

//         {/* Desktop Navigation Links */}
//         <ul className="nav-links">
//           <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick('/UserInputForm')}>Home</a></li>
//           <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick('/results')}>Calculator</a></li>
//           <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick('/met')}>Met Table</a></li>
//           <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick('/user')}>About</a></li>
//           <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick('/social')}>Social</a></li>
//         </ul>

//         {/* Mobile Navigation Menu (conditionally rendered) */}
//         <ul className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
//           <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick('/food')}>Home</a></li>
//           <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick('/results')}>Calculator</a></li>
//           <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick('/met')}>Met Table</a></li>
//           <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick('/user')}>About</a></li>
//           <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick('/social')}>Social</a></li>
//         </ul>
//       </nav>

//       {/* Main Content */}
//       <div className="homepage-content">
//         <div className="homepage-logo"></div>
//         <h2 className="homepage-heading">
//           Balance Your Indulgence with Activity.
//         </h2>
//         <p className="homepage-subheading">
//           Fuel & Fire helps you understand the exercise equivalents of your favorite foods, empowering you to make informed choices and maintain a healthy lifestyle without restriction.
//         </p>
//         <button className="homepage-cta-button" onClick={() => handleNavLinkClick('calculator')}>
//           Start Balancing Now
//         </button>
//       </div>

//       {/* Footer (can be a shared component later) */}
//       <div className="homepage-footer">
//         <p>&copy; 2025 Fuel & Fire. All rights reserved.</p>
//         <p className="disclaimer-text">
//           <span className="disclaimer-bold">Disclaimer:</span> Calorie and exercise values are approximate and for guidance only. Consult a professional for personalized advice.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
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
          onClick={() => handleNavLinkClick("/calculator")}
        >
          Start Balancing Now
        </button>
      </div>

      <div className="homepage-footer">
        <p>&copy; 2025 Fuel & Fire. All rights reserved.</p>
        <p className="disclaimer-text">
          <span className="disclaimer-bold">Disclaimer:</span> Calorie and
          exercise values are approximate...
        </p>
      </div>
    </div>
  );
};

export default HomePage;
