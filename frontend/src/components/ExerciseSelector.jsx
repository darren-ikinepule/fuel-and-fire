// ExerciseSelector.jsx - Fuel & Fire clean, responsive, with persistent highlighting

import React from 'react';
import '../stylesheets/exercise-selector.css';

// Static exercise database with intensity levels in parentheses
// Organized by activity type for easy maintenance and potential future categorization
const exerciseOptions = [
  { name: "Running (8 km/h)" },
  { name: "Jumping Jacks" },
  { name: "Cycling (moderate)" },
  { name: "Walking (brisk)" },
  { name: "Swimming (moderate)" },
  { name: "Push-ups (vigorous)" },
  { name: "Burpees (moderate-vigorous)" },
  { name: "Hiking (moderate terrain)" },
  { name: "Skipping Rope (vigorous)" },
  { name: "Dancing (moderate)" },
  { name: "Yoga (Hatha/General)" },
  { name: "Rowing Machine (moderate)" },
  { name: "Stair Climbing (vigorous)" },
  { name: "Plank (isometric)" }
];

/**
 * ExerciseSelector - Multi-select component for choosing exercises to split calorie burn
 * Implements toggle selection pattern with persistent visual feedback
 * 
 * @param {Function} onSelect - Callback fired when exercise is selected/deselected
 * @param {Array} selected - Array of currently selected exercise names for controlled state
 */
function ExerciseSelector({ onSelect, selected = [] }) {
  /**
   * Handles exercise selection toggle logic
   * Delegates state management to parent component via callback pattern
   * This keeps the component stateless and reusable across different contexts
   */
  const handleToggle = (exerciseName) => {
    if (onSelect) {
      onSelect(exerciseName);
    }
  };

  return (
    <div className="exercise-selector-container">
      <h2 className="exercise-selector-title">Select Exercises to Split Your Burn</h2>
      <div className="exercise-selector-list">
        {exerciseOptions.map((exercise) => (
          <button
            key={exercise.name}
            type="button"
            // Dynamic CSS class application: combines base styling with conditional selection state
            // Uses Array.includes() for O(n) lookup - acceptable for small datasets like this
            className={`exercise-selector-item ${selected.includes(exercise.name) ? 'selected' : ''}`}
            onClick={() => handleToggle(exercise.name)}
          >
            {exercise.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExerciseSelector;