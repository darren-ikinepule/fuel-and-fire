import React, { useState } from "react";
import fastFoodInfo from "../scripts/food-info";

import "../stylesheets/food-selector.css";

function FoodSelector({ onSelect }) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleSelect = (index) => {
    let newSelected;
    if (selectedIndices.includes(index)) {
      newSelected = selectedIndices.filter(i => i !== index);
    } else {
      newSelected = [...selectedIndices, index];
    }
    setSelectedIndices(newSelected);
    if (onSelect) {
      onSelect(newSelected.map(i => fastFoodInfo[i]));
    }
  };

  return (
    <>
      <div className="heading-section">
        
        <h1 className="main-heading">Fuel & Fire</h1>
      </div>
      <div className="food-selector">
        <div className="food-list">
          {fastFoodInfo.map((food, index) => (
            <div
              key={food.name}
              className={`food-item${selectedIndices.includes(index) ? " selected" : ""}`}
              onClick={() => handleSelect(index)}
              tabIndex={0}
              role="button" // Improve accessibility for custom clickables
              aria-label={food.name}
            >
              <img
                src={food.img}
                alt={food.name}
                className="food-img"
              />
              <div className="food-name">{food.name}</div>
              <div className="food-calories">{food.calories} cal</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FoodSelector;