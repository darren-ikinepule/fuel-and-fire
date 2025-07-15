import React, { useState, useEffect } from "react";
import "../stylesheets/food-selector.css";

function FoodSelector({ onSelect }) {
  const [foodSelector, setFoodSelector] = useState([]);
  const [fastFoodInfo, setFastFoodInfo] = useState([]);

  const fetchFood = async () => {
    try {
      const response = await fetch("http://localhost:3000/food-items");
      const data = await response.json();
      console.log("Food Data Response:", data);
      setFastFoodInfo(data);
    } catch (err) {
      console.error("Error fetching food data:", err);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  const handleSelect = (index) => {
    let newSelected;
    if (foodSelector.includes(index)) {
      newSelected = foodSelector.filter((i) => i !== index);
    } else {
      newSelected = [...foodSelector, index];
    }
    setFoodSelector(newSelected);
    if (onSelect) {
      onSelect(newSelected.map((i) => fastFoodInfo[i]));
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
              className={`food-item${
                foodSelector.includes(index) ? " selected" : ""
              }`}
              onClick={() => handleSelect(index)}
              tabIndex={0}
              role="button"
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
