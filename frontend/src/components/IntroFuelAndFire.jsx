// IntroFuelAndFire.jsx - Fuel & Fire Clean Hero Introduction

import React from 'react';
import '../stylesheets/intro-fuel-and-fire.css';

function IntroFuelAndFire() {
  return (
    <div className="intro-bg">
      <div className="intro-container">
        <h1 className="intro-title">Fuel & Fire</h1>
        <p className="intro-subtitle">Your Fun Fast-Food Fitness Converter!</p>
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
            <div key={idx} className="intro-step">
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
