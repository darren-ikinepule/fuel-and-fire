// SplitBurnPlan.jsx - Interactive workout checklist with completion tracking and celebration features

import React, { useState, useEffect } from 'react';
import '../stylesheets/split-burn-plan.css';

/**
 * SplitBurnPlan - Interactive workout plan component with progress tracking
 * Displays personalized exercise split based on calorie targets and selected exercises
 * Features completion tracking, celebration feedback, and navigation utilities
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.splitExercises - Array of exercise objects with calculated values (e.g., { name, value, unit, img }).
 * @param {number} props.totalCalories - The total calories to be burned.
 * @param {Array<string>} props.selectedExercises - Array of names of exercises selected by the user.
 */
function SplitBurnPlan({ splitExercises, totalCalories, selectedExercises }) {
  // Guard clause: Early return for empty data prevents unnecessary rendering
  if (!splitExercises || splitExercises.length === 0) return null;

  // Completion tracking state - uses object map for O(1) lookup performance
  const [completedExercises, setCompletedExercises] = useState({});
  // UI state for gamification - celebration overlay visibility
  const [showCelebration, setShowCelebration] = useState(false);

  /**
   * Reset state when workout parameters change
   * Prevents stale celebration states when user modifies their workout plan
   * Dependencies: selectedExercises and totalCalories trigger state reset
   */
  useEffect(() => {
    setCompletedExercises({});
    setShowCelebration(false);
  }, [selectedExercises, totalCalories]);

  /**
   * Handles exercise completion toggle with automatic celebration detection
   * Uses immutable state update pattern and checks completion status in real-time
   * @param {string} exerciseName - The name of the exercise to toggle.
   */
  const handleToggleComplete = (exerciseName) => {
    // Immutable state update using spread operator for React optimization
    const newCompletedExercises = {
      ...completedExercises,
      [exerciseName]: !completedExercises[exerciseName],
    };
    setCompletedExercises(newCompletedExercises);

    // Real-time completion validation using Array.every() for boolean logic
    // Checks if all exercises in the current plan are marked complete
    const allCompleted = splitExercises.every((ex) => newCompletedExercises[ex.name]);
    if (allCompleted && splitExercises.length > 0) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  };

  /**
   * Dismisses celebration overlay - simple state reset for modal-like behavior
   */
  const dismissCelebration = () => {
    setShowCelebration(false);
  };

  /**
   * Smooth scroll utility for better UX navigation
   * Uses native Web API with smooth behavior for polished interaction
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
          {/* Note: Placeholder for dynamic food names - could be enhanced with actual food data */}
          your food items
        </strong>
        , which total
        <strong className="total-calories-value"> {totalCalories} calories</strong>,
        here is your workout plan split across the exercises you selected.
      </p>

      <div className="split-plan-list">
        {splitExercises.map((ex, idx) => (
          <div key={ex.name} className="split-plan-item">
            <img src={ex.img} alt={ex.name} className="split-plan-img" />

            <div className="split-plan-details">
              <span className="split-plan-exercise">{ex.name}:</span>
              <span className="split-plan-value">
                {/* Uses pre-formatted displayValue from calculation logic */}
                {/* Maintains separation between data formatting and presentation */}
                {ex.displayValue}
                {ex.repsPerMinute && (
                  <div className="reps-guidance">
                    <small className="reps-per-minute-text">
                      Aim for {ex.repsPerMinute}
                    </small>
                  </div>
                )}
              </span>
            </div>
            {/* Checkbox positioned at item end for consistent visual hierarchy */}
            <input
              type="checkbox"
              id={`exercise-checkbox-${idx}`}
              // Boolean coercion (!!） ensures proper checkbox behavior even with undefined values
              checked={!!completedExercises[ex.name]}
              onChange={() => handleToggleComplete(ex.name)}
              className="exercise-complete-checkbox"
            />
            <label>Completed</label>
          </div>
          
        ))}
      </div>

      {/* Navigation utility with accessibility considerations */}
      <button
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        // Screen reader accessibility for non-text navigation element
        aria-label="Return to top of page"
      >
        {/* Unicode arrow provides visual cue without dependency on external icons */}
        &#8593;
      </button>

      {/* Gamification feature: Conditional celebration overlay */}
      {/* Modal-like overlay provides positive reinforcement for workout completion */}
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