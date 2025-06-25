/*import React from "react";
import { calculateExercises } from "../scripts/exercise.js";

function ResultsDisplay({ food, user }) {
  // food is now an array of selected foods
  if (!food || food.length === 0 || !user.age || !user.weight) {
    return <div style={{ color: "#888" }}>Select one or more foods and enter your age and weight to see results.</div>;
  }

  const totalCalories = food.reduce((sum, f) => sum + f.calories, 0);
  const exercises = calculateExercises(totalCalories, Number(user.weight), Number(user.age));

  return (
    <div style={{ marginTop: "2rem", background: "#f9f9f9", padding: "1rem", borderRadius: 8 }}>
      <h2>Results</h2>
      <p>
        <strong>
          {food.map(f => f.name).join(", ")}
        </strong>
        : {totalCalories} calories
      </p>
      <ul>
        {exercises.map(ex => (
          <li key={ex.name}>
            {ex.name}: <strong>{ex.value}</strong> {ex.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsDisplay;
*/
import React from "react";
import { calculateExercises } from "../scripts/exercise.js";
import "../stylesheets/results-display.css"; // Assuming you have a CSS file for styling

function ResultsDisplay({ food, user }) {
  if (!food || food.length === 0 || !user.age || !user.weight) {
    return <div style={{ color: "#888" }}>Select one or more foods and enter your age and weight to see results.</div>;
  }

  const totalCalories = food.reduce((sum, f) => sum + f.calories, 0);
  const exercises = calculateExercises(totalCalories, Number(user.weight), Number(user.age));

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