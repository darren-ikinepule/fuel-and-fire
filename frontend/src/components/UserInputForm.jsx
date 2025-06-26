import React, { useState } from "react";
import "../stylesheets/user-input-form.css";

function UserInputForm({ user, onChange, onSubmit }) {
  const [localWeight, setLocalWeight] = useState(user.weight || "");

  const handleChange = e => {
    setLocalWeight(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
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
          required
        />
      </div>
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
}

export default UserInputForm;