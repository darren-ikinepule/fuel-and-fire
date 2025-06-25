import React from "react";
import "../stylesheets/user-input-form.css";
function UserInputForm({ user, onChange }) {
  const handleChange = e => {
    const { name, value } = e.target;
    onChange({ ...user, [name]: value });
  };

  return (
    <div className="user-input-form">
      <label>
        Age:{" "}
        <input
          type="number"
          name="age"
          min="5"
          max="120"
          value={user.age}
          onChange={handleChange}
          style={{ width: 60, marginRight: 10 }}
        />
      </label>
      <label>
        Weight (kg):{" "}
        <input
          type="number"
          name="weight"
          min="20"
          max="300"
          value={user.weight}
          onChange={handleChange}
          style={{ width: 80 }}
        />
      </label>
    </div>
  );
}

export default UserInputForm;