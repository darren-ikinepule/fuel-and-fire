import React from "react";
import { calculateExercises } from "../scripts/exercise";
import "../stylesheets/results-display.css";


function ResultsDisplay({ food, user }) {
  if (!food || food.length === 0 || !user.weight) {
    return <div style={{ color: "#888" }}>Select one or more foods and enter your weight to see results.</div>;
  }

  const totalCalories = food.reduce((sum, f) => sum + f.calories, 0);
  const exercises = calculateExercises(totalCalories, Number(user.weight));

  return (
    <div className="results-container">
      <h2>Results</h2>
      <p>
        <strong>
          {food.map(f => f.name).join(", ")}
        </strong>
        : {totalCalories} calories
      </p>
      <div className="exercise-list">
        {exercises.map(ex => (
          <div className="exercise-item" key={ex.name}>
            <img src={ex.img} alt={ex.name} className="exercise-img" />
            <div>
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