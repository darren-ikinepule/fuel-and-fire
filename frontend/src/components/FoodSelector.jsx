// FoodSelector.jsx - Multi-select food component with dynamic API data and UX optimizations

import React, { useState, useEffect } from "react";
import "../stylesheets/food-selector.css";

function FoodSelector({ onSelect }) {
  const [foodSelector, setFoodSelector] = useState([]);
  const [fastFoodInfo, setFastFoodInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch food data on component mount - runs once due to empty dependency array
  useEffect(() => {
    const fetchFood = async () => {
      try {
        setIsLoading(true);
        // Use Vite environment variable for API endpoint - supports different environments (dev/prod)
        const apiUrl = import.meta.env.VITE_API_URL || "https://fuel-and-fire.onrender.com";
        const response = await fetch(`${apiUrl}/food-items`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFastFoodInfo(data);
      } catch (err) {
        // Fail silently to prevent crashes - could be enhanced with user-facing error handling
        console.error("Error fetching food data:", err);
        // Set empty array on error to prevent crashes
        setFastFoodInfo([]);
      } finally {
        setIsLoading(false);
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
    e?.currentTarget?.blur();
  };

  return (
    <>
      <div className="heading-section">
        <h1 className="main-heading">Fuel & Fire</h1>
        <h2 className="istruction-text">Please Select Your Food Items</h2>
      </div>
      <div className="food-selector">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading food items...</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}

export default FoodSelector;