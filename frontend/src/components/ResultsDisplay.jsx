// ResultsDisplay.jsx - Exercise calculation results component with collapsible UI

import React from "react";
import { calculateExercises } from "../scripts/exercise";
import "../stylesheets/results-display.css";

function ResultsDisplay({ food, user, isContentVisible, toggleContentVisibility }) {
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

  const totalCalories = food.reduce((sum, f) => sum + f.calories, 0);
  const exercises = calculateExercises(totalCalories, Number(user.weight));

  return (
    <div className="results-container">
      <h2 className="results-heading">Your Fuel Burn Workout</h2>

      {isContentVisible && (
        <>
          <p className="summary-text">
            To burn off your
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