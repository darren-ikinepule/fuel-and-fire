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
  const [completedExercises, setCompletedExercises] = useState({});
  // State to control the visibility of the celebration message
  const [showCelebration, setShowCelebration] = useState(false);

  // NEW: Effect to reset the state when the exercises or food selection changes
  // This prevents the celebration message from appearing incorrectly for a new workout.
  useEffect(() => {
    setCompletedExercises({});
    setShowCelebration(false);
  }, [selectedExercises, totalCalories]);

  /**
   * Toggles the completion status of an exercise.
   * @param {string} exerciseName - The name of the exercise to toggle.
   */
  const handleToggleComplete = (exerciseName) => {
    const newCompletedExercises = {
      ...completedExercises,
      [exerciseName]: !completedExercises[exerciseName],
    };
    setCompletedExercises(newCompletedExercises);

    // Check if all exercises are now completed
    const allCompleted = splitExercises.every((ex) => newCompletedExercises[ex.name]);
    if (allCompleted && splitExercises.length > 0) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  };

  /**
   * Dismisses the celebration message.
   */
  const dismissCelebration = () => {
    setShowCelebration(false);
  };

  /**
   * Smoothly scrolls the window to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="split-burn-plan-container">
      <h2 className="split-plan-title">Your Personalized Burn Plan</h2>
      <p className="split-plan-summary">
        Based on your selection of{' '}
        <strong className="food-summary-names">
          {/* Note: In a full app, you'd pass the actual food names here */}
          your food items
        </strong>
        , which total
        <strong className="total-calories-value"> {totalCalories} calories</strong>,
        here is your workout plan split across the exercises you selected.
      </p>

      <div className="split-plan-list">
        {splitExercises.map((ex, idx) => (
          <div key={ex.name} className="split-plan-item">
            {/* Display the exercise image */}
            <img src={ex.img} alt={ex.name} className="split-plan-img" />

            {/* Display the exercise name and value */}
            <div className="split-plan-details">
              <span className="split-plan-exercise">{ex.name}:</span>
              <span className="split-plan-value">
                {/* UPDATED: Use the formatted string for the value */}
                {ex.displayValue}
              </span>
            </div>
            {/* UPDATED: Checkbox moved to the end of the flex item */}
            <input
              type="checkbox"
              id={`exercise-checkbox-${idx}`}
              checked={!!completedExercises[ex.name]} // Ensure it's a boolean
              onChange={() => handleToggleComplete(ex.name)}
              className="exercise-complete-checkbox"
            />
            <label>Completed</label>
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

export default SplitBurnPlan; //works
