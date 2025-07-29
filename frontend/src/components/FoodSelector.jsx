// FoodSelector.jsx – With deselect visual fix via blur()

import React, { useState, useEffect } from "react";
import "../stylesheets/food-selector.css";

function FoodSelector({ onSelect }) {
  const [foodSelector, setFoodSelector] = useState([]);
  const [fastFoodInfo, setFastFoodInfo] = useState([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/food-items`);
        const data = await response.json();
        setFastFoodInfo(data);
      } catch (err) {
        console.error("Error fetching food data:", err);
      }
    };
    fetchFood();
  }, []);

  const handleSelect = (index, e) => {
    const newSelected = foodSelector.includes(index)
      ? foodSelector.filter((i) => i !== index)
      : [...foodSelector, index];

    setFoodSelector(newSelected);
    onSelect?.(newSelected.map((i) => fastFoodInfo[i]));

    // Remove focus immediately to prevent focus styles
    e?.currentTarget?.blur();
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
              className={`food-item${foodSelector.includes(index) ? " selected" : ""}`}
              onClick={(e) => handleSelect(index, e)}
              role="button"
              tabIndex={0}
              aria-label={food.name}
            >
              <img src={food.img} alt={food.name} className="food-img" />
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
