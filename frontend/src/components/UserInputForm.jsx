// UserInputForm.jsx - Weight input component with real-time validation and error handling

import React, { useState } from "react";
import "../stylesheets/user-input-form.css";

/**
 * UserInputForm - Controlled form component for weight input with validation
 * Features local state management, real-time validation feedback, and dual callback pattern
 * Implements defensive validation with user-friendly error messaging
 */
function UserInputForm({ user, onChange, onSubmit }) {
  // Local state for controlled input - maintains form responsiveness during typing
  // Initialized with existing user weight or empty string for new users
  const [localWeight, setLocalWeight] = useState(user.weight || "");
  // Error state for immediate validation feedback without blocking user input
  const [error, setError] = useState("");

  /**
   * Handles input changes with real-time validation clearing
   * Implements optimistic UX - clears errors as soon as input becomes valid
   * Prevents error message persistence during active correction
   */
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalWeight(value);
    // Proactive error clearing: Remove error message when input enters valid range
    // Provides immediate positive feedback during user correction
    if (value && Number(value) >= 20 && Number(value) <= 300) {
      setError("");
    }
  };

  /**
   * Form submission with comprehensive validation and dual callback pattern
   * Validates against realistic human weight constraints (20-300kg)
   * Implements both onChange for state sync and onSubmit for action triggering
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const weightNum = Number(localWeight);

    // Validation gate: Block submission for invalid inputs with clear user guidance
    // Range validation prevents unrealistic values that would break calorie calculations
    if (!localWeight || weightNum < 20 || weightNum > 300) {
      setError("Please enter a valid weight between 20–300 kg before calculating.");
      return; // Early return prevents further execution on validation failure
    }

    setError(""); // Clear validation errors on successful submission
    // Dual callback pattern: onChange for parent state sync, onSubmit for action triggering
    onChange({ weight: localWeight });
    onSubmit?.(weightNum); // Optional chaining prevents errors if onSubmit not provided
  };

  return (
    <form className="user-input-form" onSubmit={handleSubmit}>
      {/* Error placement optimization: Position above input for immediate visibility */}
      {/* Prevents layout shift and ensures users see validation feedback quickly */}
      {error && (
        <p className="error-message">{error}</p>
      )}
      
      <div className="input-group">
        {/* Semantic HTML: Proper label association for accessibility and screen readers */}
        <label htmlFor="weight-input" className="input-label">
          Enter Weight (kg):
        </label>
        <input
          id="weight-input"
          type="number"
          name="weight"
          // HTML validation attributes provide browser-level constraints
          // Acts as first line of defense before JavaScript validation
          min="20"
          max="300"
          value={localWeight}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., 70"
          required
        />
      </div>
      <button type="submit" className="submit-btn">
        Calculate Fuel Burn
      </button>
    </form>
  );
}

export default UserInputForm;