// ResultsDisplay.jsx - Exercise calculation results component with collapsible UI

import React from "react";
import { calculateExercises } from "../scripts/exercise";
import "../stylesheets/results-display.css";

/**
 * ResultsDisplay - Renders personalized workout recommendations based on food selections
 * Features conditional rendering, data validation, and collapsible content for better UX
 * Calculates exercise equivalents using user weight and total calorie intake
 */
function ResultsDisplay({ food, user, isContentVisible, toggleContentVisibility }) {
  // Guard clause pattern: Early return for invalid/incomplete data states
  // Prevents unnecessary calculations and provides clear user guidance
  if (!food || food.length === 0 || !user.weight) {
    return (
      <div className="results-container placeholder">
        <p>
          <strong style={{ color: "var(--color-orange-fluorescent)" }}>Select one or more foods</strong> and
          <strong style={{ color: "var(--color-orange-fluorescent)" }}> enter your weight</strong> to see your personalized workout.
        </p>
      </div>
    );
  }

  // Aggregate total calories from selected food items using reduce for functional approach
  const totalCalories = food.reduce((sum, f) => sum + f.calories, 0);
  // External calculation logic keeps component focused on presentation
  // Number() conversion ensures weight is numeric for mathematical operations
  const exercises = calculateExercises(totalCalories, Number(user.weight));

  return (
    <div className="results-container">
      <h2 className="results-heading">Your Fuel Burn Workout</h2>

      {/* Progressive disclosure pattern: Show detailed content only when requested */}
      {isContentVisible && (
        <>
          <p className="summary-text">
            To burn off your 
            {/* Dynamic food name concatenation with proper spacing and formatting */}
            <strong className="food-summary-names">
              {" "}
              {food.map(f => f.name).join(", ")}{" "}
            </strong><br/>
            totaling 
            <strong className="total-calories-value">
              {" "}
              {totalCalories} calories{" "}
            </strong>
            you can:
          </p>
          <div className="exercise-list">
            {exercises.map(ex => (
              <div className="exercise-item" key={ex.name}>
                <img src={ex.img} alt={ex.name} className="exercise-img" />
                <div className="exercise-details">
                  <span className="exercise-label">{ex.name}:</span>
                  <span className="exercise-value">
                    {/* Uses pre-formatted displayValue from calculation module */}
                    {/* Separates data formatting logic from presentation component */}
                    <strong>{ex.displayValue}</strong>
                    {ex.repsPerMinute && (
                      <div className="reps-guidance">
                        <small className="reps-per-minute-text">
                          Aim for {ex.repsPerMinute}
                        </small>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Toggle button positioned at bottom for consistent UI flow */}
      {/* Button text dynamically reflects current state for clear user feedback */}
      <button
        onClick={toggleContentVisibility}
        className="toggle-results-btn-bottom"
      >
        {isContentVisible ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
}

export default ResultsDisplay;