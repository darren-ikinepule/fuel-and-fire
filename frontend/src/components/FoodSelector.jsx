// FoodSelector.jsx - Multi-select food component with dynamic API data and UX optimizations

import React, { useState, useEffect } from "react";
import "../stylesheets/food-selector.css";

/**
 * FoodSelector - Dynamic multi-select food component that fetches items from API
 * Manages selection state internally and communicates changes to parent via callback
 * Implements accessibility features and UX optimizations for touch/click interactions
 */
function FoodSelector({ onSelect }) {
  // Track selected food indices - using indices instead of objects for efficient comparison
  const [foodSelector, setFoodSelector] = useState([]);
  // Store complete food data from API including images, names, and calorie information
  const [fastFoodInfo, setFastFoodInfo] = useState([]);

  // Fetch food data on component mount - runs once due to empty dependency array
  useEffect(() => {
    const fetchFood = async () => {
      try {
        // Use Vite environment variable for API endpoint - supports different environments (dev/prod)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/food-items`);
        const data = await response.json();
        setFastFoodInfo(data);
      } catch (err) {
        // Fail silently to prevent crashes - could be enhanced with user-facing error handling
        console.error("Error fetching food data:", err);
      }
    };
    fetchFood();
  }, []);

  /**
   * Handles toggle selection logic with UX optimizations
   * Uses index-based selection for performance and immutable state updates
   */
  const handleSelect = (index, e) => {
    // Toggle logic: remove if already selected, add if not selected
    // Using filter() and spread operator for immutable state updates
    const newSelected = foodSelector.includes(index)
      ? foodSelector.filter((i) => i !== index)
      : [...foodSelector, index];

    setFoodSelector(newSelected);
    // Map indices back to full food objects for parent component
    // Optional chaining (?.) prevents errors if onSelect is undefined
    onSelect?.(newSelected.map((i) => fastFoodInfo[i]));

    // UX enhancement: Remove focus ring after click to prevent sticky hover states
    // Particularly important for touch devices where focus can persist after tap
    e?.currentTarget?.blur();
  };

  return (
    <>
      <div className="heading-section">
        <h1 className="main-heading">Fuel & Fire</h1>
        <h2 className="istruction-text">Please Select Your Food Items</h2>
      </div>
      <div className="food-selector">
        <div className="food-list">
          {fastFoodInfo.map((food, index) => (
            <div
              key={food.name}
              // Dynamic CSS class construction for selection state visual feedback
              className={`food-item${foodSelector.includes(index) ? " selected" : ""}`}
              onClick={(e) => handleSelect(index, e)}
              // Accessibility: Make div keyboard navigable and screen reader friendly
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