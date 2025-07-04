import React from "react";
import { calculateExercises } from "../scripts/exercise";
import "../stylesheets/results-display.css";


function ResultsDisplay({ food, user }) {
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
      <p className="summary-text">
        To burn off your 
        <strong className="food-summary-names">
          {" "}
          {food.map(f => f.name).join(", ")}{" "}
        </strong>
        totaling 
        <strong className="total-calories-value">
          {" "}
          {totalCalories} calories{" "}
        </strong>
        you'll need to do:
      </p>
      <div className="exercise-list">
        {exercises.map(ex => (
          <div className="exercise-item" key={ex.name}>
            <img src={ex.img} alt={ex.name} className="exercise-img" />
            <div className="exercise-details">
              <span className="exercise-label">{ex.name}:</span>
              <span className="exercise-value">
                <strong>{ex.value}</strong> {ex.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;