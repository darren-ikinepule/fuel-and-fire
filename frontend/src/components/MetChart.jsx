import React from 'react';
import '../stylesheets/met-chart.css';
import { metValues } from "../scripts/met-values.js";
// Define the MET values and caloriesPerRep for exercises
// This data is included directly for self-containment as requested.


// MetChart Component
const MetChart = () => {
  return (
    <div className="met-chart-container">
      {/* Header */}
      <header className="met-chart-header">
        <h1 className="met-chart-title">EXERCISE MET VALUES</h1>
        <p className="met-chart-subtitle">Understand the Intensity of Your Burn!</p>
      </header>

      {/* New: What is MET section */}
      <section className="met-explanation-section">
        <h2 className="met-explanation-title">What is a MET?</h2>
        <p className="met-explanation-text">
          A **MET** (Metabolic Equivalent of Task) is a simple way to measure how much energy your body uses during different activities compared to when you're resting. Think of it as a multiplier: 1 MET is the energy you burn just sitting still. So, an activity with a 5 MET value means you're burning 5 times more energy than at rest! For exercises like push-ups and burpees, we use a direct 'calories per rep' value for an easier understanding of the effort per movement.
        </p>
      </section>

      {/* Chart Grid */}
      <main className="met-chart-main">
        <div className="met-chart-grid">
          {metValues.map((exercise, index) => (
            <div
              key={index}
              className="met-chart-card"
            >
              {/* Exercise Image */}
              <img
                src={exercise.img}
                alt={exercise.name}
                className="met-chart-card-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/333/AAA?text=ICON"; }} // Fallback image
              />

              {/* Exercise Name */}
              <h3 className="met-chart-card-name">{exercise.name}</h3>

              {/* MET Value or Calories per Rep */}
              {exercise.met !== undefined ? (
                <p className="met-chart-card-value">
                  {exercise.met} <span className="met-chart-card-unit">METs</span>
                </p>
              ) : (
                <p className="met-chart-card-value">
                  {exercise.caloriesPerRep} <span className="met-chart-card-unit">cal/rep</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </main>

      
    
    </div>
  );
};

export default MetChart;
