// components/ExerciseSelector.jsx (regenerated for persistent highlighting)

import React from 'react';
import '../stylesheets/exercise-selector.css';

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

function ExerciseSelector({ onSelect, selected }) {
  const handleToggle = (name) => {
    onSelect(name);
  };

  return (
    <div className="exercise-selector-container">
      <h2 className="exercise-selector-title">Select Exercises to Split Your Burn</h2>
      <div className="exercise-selector-list">
        {exerciseOptions.map((exercise) => (
          <button
            key={exercise.name}
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
