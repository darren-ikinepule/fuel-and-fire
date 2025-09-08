// MetChart.jsx - Educational reference component displaying exercise intensity data with MET values

import React from 'react';
import '../stylesheets/met-chart.css';
import { metValues } from "../scripts/met-values.js";

/**
 * MetChart - Educational component that displays standardized exercise intensity data
 * Provides users with reference information about MET (Metabolic Equivalent of Task) values
 * Features dual measurement systems: MET values for timed activities, calories per rep for discrete exercises
 */
const MetChart = () => {
  /**
   * Smooth scroll utility for better UX navigation
   * Uses native Web API with smooth behavior for polished interaction
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="met-chart-container">
      <header className="met-chart-header">
        <h1 className="met-chart-title">Exercise MET Values</h1>
        <p className="met-chart-subtitle">Understand the Intensity of Your Burn!</p>
      </header>

      {/* Educational content section - explains MET concept and calculation methodology */}
      <section className="met-explanation-section">
        <h2 className="met-explanation-title">What is a MET?</h2>
        <p className="met-explanation-text">
          A **MET** (Metabolic Equivalent of Task) measures how much energy your body uses during activities compared to resting. 1 MET is your resting energy. An activity with 5 METs means you burn 5x more energy. For push-ups or burpees, we show **calories per rep** so you can see effort per movement.
        </p>
       
        {/* Formula transparency - shows users the mathematical basis for calculations */}
        {/* Builds user trust and understanding of the science behind the app */}
        <p className='met-explanation-text'>
          Our calculations are based on standard MET values and your body weight. For exercises measured in minutes, we use the formula:
          <br />
          <strong className='met-calculation-text' style={{ color: 'var(--color-orange-fluorescent)' }}>Calories per Minute = (MET * User Weight in kg * 3.5) / 200</strong>.
          <br />
          For exercises like push-ups and burpees, we use a fixed calorie burn per repetition. This helps you get a personalized estimate of the effort needed to burn off your selected food.
        </p>
       
      </section>

      <main className="met-chart-main">
        <div className="met-chart-grid">
          {/* Data-driven rendering from external MET values module */}
          {/* Separation of concerns: data management separate from presentation logic */}
          {metValues.map((exercise, index) => (
            <div key={index} className="met-chart-card">
              <img
                src={exercise.img}
                alt={exercise.name}
                className="met-chart-card-image"
                // Defensive image handling: Fallback placeholder prevents broken image display
                // Ensures consistent visual experience even with missing/failed image resources
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/333/AAA?text=ICON"; }}
              />
              <h3 className="met-chart-card-name">{exercise.name}</h3>
              <p className="met-chart-card-value">
                {/* Conditional value display: Shows MET or calories per rep based on exercise type */}
                {/* Nullish coalescing (??) provides fallback when MET value doesn't exist */}
                {exercise.met ?? exercise.caloriesPerRep}
                {/* Dynamic unit labeling: Adapts display text based on measurement type */}
                <span className="met-chart-card-unit">{exercise.met ? " METs" : " cal/rep"}</span>
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Navigation utility with accessibility considerations */}
      <button
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        // Screen reader accessibility for non-text navigation element
        aria-label="Return to top of page"
      >
        {/* Unicode arrow provides visual cue without dependency on external icons */}
        &#8593;
      </button>
    </div>
  );
};

export default MetChart;