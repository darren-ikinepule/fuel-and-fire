// UserInputForm.jsx
import React, { useState } from "react";
import "../stylesheets/user-input-form.css";

function UserInputForm({ user, onChange, onSubmit }) {
  const [localWeight, setLocalWeight] = useState(user.weight || "");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalWeight(value);
    // Clear error immediately if input starts becoming valid
    if (value && Number(value) >= 20 && Number(value) <= 300) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const weightNum = Number(localWeight);

    // Perform validation within UserInputForm
    if (!localWeight || weightNum < 20 || weightNum > 300) {
      setError("Please enter a valid weight between 20–300 kg before calculating.");
      return; // Stop here if validation fails in this component
    }

    setError(""); // Clear any previous error
    onChange({ weight: localWeight });
    onSubmit?.(weightNum);
  };

  return (
    <form className="user-input-form" onSubmit={handleSubmit}>
      {/* === START OF CORRECTION: Moved error message here, ABOVE the input-group === */}
      {error && (
        <p className="error-message">{error}</p>
      )}
      {/* === END OF CORRECTION === */}
      <div className="input-group">
        <label htmlFor="weight-input" className="input-label">
          Enter Weight (kg):
        </label>
        <input
          id="weight-input"
          type="number"
          name="weight"
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