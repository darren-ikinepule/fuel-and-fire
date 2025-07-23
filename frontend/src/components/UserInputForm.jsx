// UserInputForm.jsx (final working validation fix)

import React, { useState } from "react";
import "../stylesheets/user-input-form.css";

function UserInputForm({ user, onChange, onSubmit }) {
  const [localWeight, setLocalWeight] = useState(user.weight || "");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLocalWeight(e.target.value);
    if (e.target.value && Number(e.target.value) >= 20) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const weightNum = Number(localWeight);
    if (!localWeight || weightNum < 20 || weightNum > 300) {
      setError("Please enter a valid weight between 20-300 kg before calculating.");
      return;
    }
    setError("");
    onChange({ weight: localWeight });
    if (onSubmit) onSubmit();
  };

  return (
    <form className="user-input-form" onSubmit={handleSubmit}>
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
        {error && <p className="error-message" style={{ color: 'var(--color-orange-fluorescent)', marginTop: '0.5rem' }}>{error}</p>}
      </div>
      <button type="submit" className="submit-btn">Calculate Fuel Burn</button>
    </form>
  );
}

export default UserInputForm;
