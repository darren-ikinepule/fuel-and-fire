// IntroFuelAndFire.jsx - Interactive app introduction with step-by-step onboarding flow

import React from 'react';
import { useNavigate } from "react-router-dom";
import '../stylesheets/intro-fuel-and-fire.css';

/**
 * IntroFuelAndFire - Onboarding component that explains app functionality through interactive steps
 * Features clickable step cards that serve as both education and navigation elements
 * Uses data-driven rendering for maintainable step content and consistent user experience
 */
function IntroFuelAndFire() {
  // React Router navigation hook for programmatic routing
  const navigate = useNavigate();

  /**
   * Navigation handler with potential for future menu state management
   * Centralized navigation logic allows for consistent behavior across interactive elements
   */
  const handleCalculateLinkClick = (path) => {
    navigate(path);
    // Note: setIsMenuOpen removed as menu state not managed in this component
    // Could be reintroduced if global menu state management is implemented
  };

  return (
    <div className="intro-bg">
      <div className="intro-container">
        <h1 className="intro-title">Fuel & Fire</h1>
        <p className="intro-subtitle">Your Fun Fast-Food Fitness Converter!</p>
        <div className="intro-steps">
          {/* Data-driven step rendering: Maintains consistency and enables easy content updates */}
          {/* Each step serves dual purpose: educational content and navigation trigger */}
          {[
            {
              emoji: '🍔',
              title: 'Pick Your Treat!',
              desc: "Craving McDonald's, KFC, or Burger King? Select your favorite fast-food item.",
            },
            {
              emoji: '🔥',
              title: 'Calorie Insight!',
              desc: '"Fuel & Fire" instantly calculates the calorie content of your chosen meal.',
            },
            {
              emoji: '⏱️',
              title: 'Burn It Off!',
              desc: 'Discover how many minutes of activity it takes to burn it off using MET calculations.',
            },
          ].map((step, idx) => (
            /* Interactive step cards: Clickable educational elements that also serve as navigation */
            /* onClick handler makes entire step card a navigation target for improved UX */
            <div key={idx} className="intro-step" onClick={() => handleCalculateLinkClick("/calculator")}>
              {/* Accessibility implementation: role and aria-label provide context for screen readers */}
              {/* Ensures emoji content is meaningful to assistive technology users */}
              <span className="intro-emoji" role="img" aria-label={step.title}>{step.emoji}</span>
              <h2 className="intro-step-title">{step.title}</h2>
              <p className="intro-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="intro-fun">
          <span className="intro-emoji" role="img" aria-label="sparkles">✨</span>
          <p className="intro-fun-text">
            A fun, curious way to stay aware of your fitness goals!
          </p>
        </div>
      </div>
    </div>
  );
}

export default IntroFuelAndFire;