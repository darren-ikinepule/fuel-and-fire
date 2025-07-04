import React from 'react';
import '../stylesheets/intro-fuel-and-fire.css'; // Ensure you have this CSS file for styling

function IntroFuelAndFire() {
  return (
    <div className="intro-bg">
      <div className="intro-container">
        <h1 className="intro-title">Fuel & Fire</h1>
        <p className="intro-subtitle">
          Your Fun Fast-Food Fitness Converter!
        </p>
        <div className="intro-steps">
          {/* Removed specific step colors as the background will be uniform dark */}
          <div className="intro-step">
            <span className="intro-emoji" role="img" aria-label="utensils">🍔</span>
            <h2 className="intro-step-title">Pick Your Treat!</h2>
            <p className="intro-step-desc">
              Craving McDonald's, KFC, or Burger King? Simply select your favorite fast-food item.
            </p>
          </div>
          <div className="intro-step">
            <span className="intro-emoji" role="img" aria-label="flame">🔥</span>
            <h2 className="intro-step-title">Calorie Insight!</h2>
            <p className="intro-step-desc">
              "Fuel & Fire" instantly calculates the calorie content of your chosen meal.
            </p>
          </div>
          <div className="intro-step">
            <span className="intro-emoji" role="img" aria-label="timer">⏱️</span>
            <h2 className="intro-step-title">Burn It Off!</h2>
            <p className="intro-step-desc">
              Discover how many minutes of activity it takes to burn off that delicious indulgence, using MET calculations.
            </p>
          </div>
        </div>
        <div className="intro-fun">
          <span className="intro-emoji" role="img" aria-label="sparkles">✨</span>
          <p className="intro-fun-text">
            It's a fun, curious way for everyday people to stay aware of their fitness goals!
          </p>
        </div>
      </div>
    </div>
  );
}

export default IntroFuelAndFire;