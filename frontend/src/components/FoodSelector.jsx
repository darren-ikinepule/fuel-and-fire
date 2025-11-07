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
  // Track loading state for food data
  const [isLoading, setIsLoading] = useState(true);

  // Fetch food data on component mount - runs once due to empty dependency array
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const cacheKey = "fuel-fire/food-items";

    const readCache = () => {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (!cached) return null;
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed : null;
      } catch (err) {
        console.warn("Failed to parse cached food data, clearing cache.", err);
        sessionStorage.removeItem(cacheKey);
        return null;
      }
    };

    const writeCache = (data) => {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        console.warn("Unable to cache food data:", err);
      }
    };

    const cachedData = readCache();
    if (cachedData) {
      setFastFoodInfo(cachedData);
      setIsLoading(false);
    }

    const fetchFood = async (showSpinner) => {
      try {
        if (showSpinner) {
          setIsLoading(true);
        }
        // Use Vite environment variable for API endpoint - supports different environments (dev/prod)
        const apiUrl = import.meta.env.VITE_API_URL || "https://fuel-and-fire.onrender.com";
        const response = await fetch(`${apiUrl}/food-items`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setFastFoodInfo(data);
          writeCache(data);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        // Fail silently to prevent crashes - could be enhanced with user-facing error handling
        console.error("Error fetching food data:", err);
        if (isMounted && !cachedData) {
          // Set empty array on error to prevent crashes
          setFastFoodInfo([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Perform SWR-style fetch: show cached data immediately, refresh in background
    fetchFood(!cachedData);

    return () => {
      isMounted = false;
      controller.abort();
    };
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
        )}
      </div>
    </>
  );
}

export default FoodSelector;