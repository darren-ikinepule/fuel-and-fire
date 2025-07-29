// MetChart.jsx - Fuel & Fire MET Values Reference

import React from 'react';
import '../stylesheets/met-chart.css';
import { metValues } from "../scripts/met-values.js";

const MetChart = () => {
  return (
    <div className="met-chart-container">
      <header className="met-chart-header">
        <h1 className="met-chart-title">Exercise MET Values</h1>
        <p className="met-chart-subtitle">Understand the Intensity of Your Burn!</p>
      </header>

      <section className="met-explanation-section">
        <h2 className="met-explanation-title">What is a MET?</h2>
        <p className="met-explanation-text">
          A <strong>MET</strong> (Metabolic Equivalent of Task) measures how much energy your body uses during activities compared to resting. 1 MET is your resting energy. An activity with 5 METs means you burn 5x more energy. For push-ups or burpees, we show <strong>calories per rep</strong> so you can see effort per movement.
        </p>
      </section>

      <main className="met-chart-main">
        <div className="met-chart-grid">
          {metValues.map((exercise, index) => (
            <div key={index} className="met-chart-card">
              <img
                src={exercise.img}
                alt={exercise.name}
                className="met-chart-card-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/333/AAA?text=ICON"; }}
              />
              <h3 className="met-chart-card-name">{exercise.name}</h3>
              <p className="met-chart-card-value">
                {exercise.met ?? exercise.caloriesPerRep}
                <span className="met-chart-card-unit">{exercise.met ? " METs" : " cal/rep"}</span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MetChart;
