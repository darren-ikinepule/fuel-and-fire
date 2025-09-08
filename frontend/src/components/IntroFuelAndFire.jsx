// IntroFuelAndFire.jsx - Enhanced about page with compelling story and interactive elements

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../stylesheets/intro-fuel-and-fire.css';

/**
 * IntroFuelAndFire - Enhanced about page that tells the Fuel & Fire story
 * Features compelling narrative, problem statement, wow-factor, and interactive elements
 * Combines storytelling with clear value proposition and call-to-action
 */
function IntroFuelAndFire() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCalculateLinkClick = (path) => {
    navigate(path);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="intro-bg">
      <div className="intro-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="intro-title">Fuel & Fire</h1>
          <p className="intro-subtitle">Ignite Your Fitness Awareness</p>
          <div className="hero-description">
            <p>Welcome to the core details of <strong>"Fuel & Fire,"</strong> the app designed to ignite your fitness awareness with a sleek, edgy, and sporty vibe!</p>
          </div>
        </div>

        {/* Problem Statement Section */}
        <div className="story-section problem-section">
          <div className="section-header">
            <span className="section-icon" role="img" aria-label="problem">🤔</span>
            <h2 className="section-title">The Problem</h2>
          </div>
          <div className="section-content">
            <p>Many people find it hard to grasp how much exercise is needed to burn off fast-food calories, creating a gap between their eating habits and fitness goals or just general curiosity.</p>
            <div className="problem-highlight">
              <span className="highlight-icon">💡</span>
              <p><strong>Fuel & Fire solves this</strong> by visually translating fast-food consumption into relatable exercise, making calorie awareness fun and motivating.</p>
            </div>
          </div>
        </div>

        {/* Wow Factor Section */}
        <div className="story-section wow-section">
          <div className="section-header">
            <span className="section-icon" role="img" aria-label="wow">✨</span>
            <h2 className="section-title">The Wow-Factor</h2>
          </div>
          <div className="section-content">
            <p>The wow-factor of Fuel & Fire lies in its ability to instantly transform abstract calorie counts into relatable, real-world exercise challenges, presented with a visually striking and motivating interface.</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="story-section how-it-works">
          <div className="section-header">
            <span className="section-icon" role="img" aria-label="process">⚡</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="intro-steps">
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
              <div key={idx} className="intro-step" onClick={() => handleCalculateLinkClick("/calculator")}>
                <span className="intro-emoji" role="img" aria-label={step.title}>{step.emoji}</span>
                <h3 className="intro-step-title">{step.title}</h3>
                <p className="intro-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section - Expandable */}
        <div className="story-section features-section">
          <div className="section-header" onClick={toggleExpanded} style={{ cursor: 'pointer' }}>
            <span className="section-icon" role="img" aria-label="features">🚀</span>
            <h2 className="section-title">Key Features</h2>
            <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
          </div>
          {isExpanded && (
            <div className="section-content features-grid">
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h4>Precise Calculations</h4>
                <p>Uses MET (Metabolic Equivalent of Task) values for accurate exercise calculations</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🤖</span>
                <h4>AI-Powered Analysis</h4>
                <p>Custom food selector with AI to analyze any food from natural language</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h4>Responsive Design</h4>
                <p>Works perfectly on all devices with sleek, modern interface</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💪</span>
                <h4>Personalized Plans</h4>
                <p>Create custom burn plans with exercise selection and tracking</p>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="intro-fun">
            <span className="intro-emoji" role="img" aria-label="sparkles">🔥</span>
            <p className="intro-fun-text">
              Ready to transform your relationship with food and fitness?
            </p>
            <button 
              className="cta-button"
              onClick={() => handleCalculateLinkClick("/calculator")}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroFuelAndFire;