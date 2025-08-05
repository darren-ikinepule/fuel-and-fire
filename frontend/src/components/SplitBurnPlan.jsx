// SplitBurnPlan.jsx - Fuel & Fire clean, responsive split burn summary with checklist
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import '../stylesheets/split-burn-plan.css'; // Ensure this CSS file contains the .scroll-to-top-btn styles

/**
 * Renders the split burn plan, showing how total calories are divided across selected exercises.
 * Includes a checklist feature for users to mark exercises as completed.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.splitExercises - Array of exercise objects with calculated values (e.g., { name, value, unit, img }).
 * @param {number} props.totalCalories - The total calories to be burned.
 * @param {Array<string>} props.selectedExercises - Array of names of exercises selected by the user.
 */
function SplitBurnPlan({ splitExercises, totalCalories, selectedExercises }) {
  // Check if there are exercises to display; if not, return null to render nothing.
  if (!splitExercises || splitExercises.length === 0) return null;

  // State to manage the checked status of each exercise
  // Using an object where keys are exercise names and values are booleans (true if checked)
  const [completedExercises, setCompletedExercises] = useState({});
  // NEW: State to control the visibility of the celebration message
  const [showCelebration, setShowCelebration] = useState(false);

  // Effect to check if all exercises are completed and show celebration
  useEffect(() => {
    // Get the names of all exercises in the current plan
    const allExerciseNames = splitExercises.map(ex => ex.name);
    // Check if every exercise name is present in completedExercises and is true
    const allCompleted = allExerciseNames.length > 0 &&
                         allExerciseNames.every(name => completedExercises[name]);

    if (allCompleted) {
      setShowCelebration(true);
    } else {
      // Hide celebration if not all are completed (e.g., user unchecked one)
      setShowCelebration(false);
    }
  }, [completedExercises, splitExercises]); // Dependencies: runs when completion status or exercises change

  // Function to smoothly scroll the window to the top of the page.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scroll animated and smooth.
    });
  };

  // Handler for when an exercise checkbox is toggled
  const handleToggleComplete = (exerciseName) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName] // Toggle the boolean value for the specific exercise
    }));
  };

  // NEW: Handler to dismiss the celebration message
  const dismissCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <div className="split-burn-plan-container">
      <h2 className="split-plan-title">Your Split Burn Plan</h2>

      <p className="split-plan-summary">
        Dividing <strong className="orange">{totalCalories} calories</strong> across{" "}
        <strong className="orange">{selectedExercises.join(", ")}</strong>
      </p>
      <div className="split-plan-list">
        {splitExercises.map((ex, idx) => (
          // Apply a 'completed' class if the exercise is marked as complete
          <div key={idx} className={`split-plan-item ${completedExercises[ex.name] ? 'completed' : ''}`}>
            {/* Display exercise image if available, otherwise consider a placeholder or default icon */}
            {ex.img && <img src={ex.img} alt={ex.name} className="split-plan-img" />}
            <div className="split-plan-details">
              <span className="split-plan-exercise">{ex.name}:</span>
              <span className="split-plan-value">{ex.value} {ex.unit}</span>
            </div>
            {/* UPDATED: Checkbox moved to the end of the flex item */}
            <input
              type="checkbox"
              id={`exercise-checkbox-${idx}`}
              checked={!!completedExercises[ex.name]} // Ensure it's a boolean
              onChange={() => handleToggleComplete(ex.name)}
              className="exercise-complete-checkbox"
            />
          </div>
        ))}
      </div>

      {/* Button to return to the top of the page */}
      <button
        onClick={scrollToTop} // Call the scrollToTop function when clicked.
        className="scroll-to-top-btn" // Apply specific styles for the button.
        aria-label="Return to top of page" // Provide an accessible label for screen readers.
      >
        &#8593; {/* Unicode character for an upward arrow */}
      </button>

      {/* NEW: Celebration Message */}
      {showCelebration && (
        <div className="celebration-message-overlay">
          <div className="celebration-message-content">
            <h3>🎉 Well Done! 🎉</h3>
            <p>You've completed your entire burn plan!</p>
            <button onClick={dismissCelebration} className="dismiss-celebration-btn">
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SplitBurnPlan;
