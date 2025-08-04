// SplitBurnPlan.jsx - Fuel & Fire clean, responsive split burn summary

import React from 'react';
import '../stylesheets/split-burn-plan.css'; // Ensure this CSS file contains the .scroll-to-top-btn styles

function SplitBurnPlan({ splitExercises, totalCalories, selectedExercises }) {
  // Check if there are exercises to display; if not, return null to render nothing.
  if (!splitExercises || splitExercises.length === 0) return null;

  // Function to smoothly scroll the window to the top of the page.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scroll animated and smooth.
    });
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
          <div key={idx} className="split-plan-item">
            {/* Display exercise image if available, otherwise use a placeholder */}
            {ex.img && <img src={ex.img} alt={ex.name} className="split-plan-img" />}
            <div className="split-plan-details">
              <span className="split-plan-exercise">{ex.name}:</span>
              <span className="split-plan-value">{ex.value} {ex.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: Return to Top Button */}
      {/* This button will appear at the bottom of the split burn plan container. */}
      <button
        onClick={scrollToTop} // Call the scrollToTop function when clicked.
        className="scroll-to-top-btn" // Apply specific styles for the button.
        aria-label="Return to top of page" // Provide an accessible label for screen readers.
      >
        &#8593; {/* Unicode character for an upward arrow */}
      </button>
    </div>
  );
}

export default SplitBurnPlan;
