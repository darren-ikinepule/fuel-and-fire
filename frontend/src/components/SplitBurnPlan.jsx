// SplitBurnPlan.jsx (Regenerated with Total Calories and Breakdown Display)

import React from 'react';
import '../stylesheets/split-burn-plan.css';

function SplitBurnPlan({ splitExercises, totalCalories, selectedExercises }) {
  if (!splitExercises || splitExercises.length === 0) {
    return null;
  }

  return (
    <div className="split-burn-plan-container">
      <h2 className="split-plan-title">Your Split Burn Plan</h2>
      <p className="split-plan-summary">
        Dividing <strong>{totalCalories} calories</strong> across <strong>{selectedExercises.join(", ")}</strong>
      </p>
      <div className="split-plan-list">
        {splitExercises.map((ex, idx) => (
          <div key={idx} className="split-plan-item">
            {ex.img && <img src={ex.img} alt={ex.name} className="split-plan-img" />}
            <div className="split-plan-details">
              <span className="split-plan-exercise">{ex.name}:</span>
              <span className="split-plan-value">{ex.value} {ex.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SplitBurnPlan;
