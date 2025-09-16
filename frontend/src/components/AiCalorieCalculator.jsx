// File: AiCalorieCalculator.jsx

import { useState, useRef, useEffect } from 'react';
import '../stylesheets/ai-calorie-converter.css';
import ExerciseSelector from './ExerciseSelector.jsx';
import SplitBurnPlan from './SplitBurnPlan.jsx';
import { calculateSplitExercises } from '../scripts/calculateSplitExercises.js';

/**
 * AiCalorieCalculator is a React component that calculates
 * nutritional information from natural language input using the Gemini API.
 */
export default function AiCalorieCalculator() {
  const [query, setQuery] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  
  // State for user's body weight
  const [weight, setWeight] = useState('');
  
  // Exercise selection and burn plan state
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [splitExercises, setSplitExercises] = useState([]);
  const [showSplitBurnPlan, setShowSplitBurnPlan] = useState(false);
  const [burnPlanError, setBurnPlanError] = useState('');
  const burnPlanSectionRef = useRef(null);

  /**
   * Fetches nutritional data from the Gemini API.
   * Uses exponential backoff for API retries to handle rate limiting.
   * @param {string} prompt The user's input string describing food items.
   * @param {number} retryCount The current retry attempt number.
   */
  const fetchNutritionData = async (prompt, retryCount = 0) => {
    // We already set loading to true in the calling function, so no need here.
    setError('');
    
    // Using a more structured prompt for better AI output
    const geminiPrompt = `Analyze the following food list and provide a detailed nutritional breakdown in a JSON array format. For each item, include the food name, total calories, protein in grams, carbohydrates in grams, and fats in grams. 

IMPORTANT: This analysis should recognize Pacific Island and Polynesian foods commonly consumed in New Zealand, including but not limited to:
- Chop suey (Pacific Island style with cabbage, onions, corned beef/mutton)
- Lu sipi/Lusipi (taro leaves cooked with lamb/mutton and coconut cream)
- Povi masima (corned beef, often cooked with vegetables)
- Oka (raw fish salad with coconut cream)
- Palusami (taro leaves with coconut cream and meat)
- Sapasui (Samoan chop suey)
- Panipopo (coconut bread rolls)
- Fa'ausi (coconut caramel dumplings)
- Koko rice (cocoa rice)
- Umu kai (earth oven cooked foods)
- Pacific Island-style taro, breadfruit, green bananas
- Coconut cream-based dishes
- Traditional Pacific preparations of familiar ingredients

When analyzing these foods, consider:

FOR FAST FOOD: Use official nutritional data from the respective chains when available. Recognize common portion descriptions (e.g., "1 KFC Quarter Pack" includes specific pieces, "Large McDonald's Fries", etc.)

FOR PACIFIC ISLAND FOODS: Consider traditional cooking methods and typical ingredient combinations. For example:
- Lu sipi typically contains taro leaves, lamb/mutton, coconut cream, onions
- Pacific chop suey often includes cabbage, onions, corned beef or mutton, sometimes potatoes
- Povi masima refers to corned beef preparations, often with root vegetables

If a food item cannot be identified or lacks sufficient nutritional data, return an object for that item with "not found" in the "food" field. 

The entire response must be a single JSON array, with keys in the following order: 'food', 'calories', 'protein_g', 'carbohydrates_g', 'fat_g'. 

Nutritional values should be provided per standard serving size (approximately 100g unless the food is typically consumed in significantly different portions).

Here is the list: ${prompt}`

    const payload = {
      contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          "type": "ARRAY",
          "items": {
            "type": "OBJECT",
            "properties": {
              "food": { "type": "STRING" },
              "calories": { "type": "NUMBER" },
              "protein_g": { "type": "NUMBER" },
              "carbohydrates_g": { "type": "NUMBER" },
              "fat_g": { "type": "NUMBER" }
            },
            "propertyOrdering": ["food", "calories", "protein_g", "carbohydrates_g", "fat_g"]
          }
        }
      }
    };
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
      allEnvVars: import.meta.env
    });
    
    if (!apiKey) {
      setLoading(false);
      setError('Gemini API key not found. Please check your environment variables.');
      throw new Error('Gemini API key not found. Please check your environment variables.');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      console.log('Making API call to:', apiUrl.substring(0, 100) + '...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (response.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => fetchNutritionData(prompt, retryCount + 1), delay);
        return;
      }
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts) {
        throw new Error('Unexpected API response structure.');
      }

      // Extract the JSON string from the response
      const jsonText = result.candidates[0].content.parts[0].text;
      
      try {
        const data = JSON.parse(jsonText);
        setNutritionData(data);
        setLoading(false);
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (parseError) {
        console.error('Failed to parse JSON:', jsonText);
        setLoading(false);
        setError('Could not parse the data. Please try again or rephrase your request.');
      }
    } catch (err) {
      console.error('API call error:', err);
      setLoading(false);
      setError(`An error occurred: ${err.message}. Please check your input and try again.`);
    }
  };

  /**
   * Calculates the sum of a specific key from the nutrition data.
   * @param {string} key The key to sum (e.g., 'calories').
   * @returns {number} The total sum.
   */
  const calculateTotal = (key) => {
    if (!nutritionData) return 0;
    return nutritionData.reduce((sum, item) => sum + (item[key] || 0), 0);
  };

  // --- START OF CHANGES ---
  const handleCalculate = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 1. Set loading state to true immediately
      setLoading(true);
      setNutritionData(null); // Clear previous results
      setError(''); // Clear previous errors
      setShowSplitBurnPlan(false); // Hide burn plan
      setBurnPlanError(''); // Clear burn plan errors
      
      // 2. Call the fetch function, which will handle setting loading to false on completion
      fetchNutritionData(query);
    }
  };
  // --- END OF CHANGES ---

  // Handler for selecting/deselecting exercises
  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  // Handler for the "View Burn Plan" button
  const handleViewBurnPlan = () => {
    if (showSplitBurnPlan) {
      setShowSplitBurnPlan(false);
      setBurnPlanError("");
      return;
    }

    if (selectedExercises.length === 0) {
      setBurnPlanError("Please select at least one exercise to view the burn plan.");
      return;
    }

    const userWeight = parseFloat(weight);
    if (!userWeight || userWeight <= 0) {
        setBurnPlanError("Please enter a valid weight in kg to get an accurate burn plan.");
        return;
    } else if (userWeight < 20 || userWeight > 300) {
        setBurnPlanError("Weight must be between 20 kg and 300 kg.");
        return;
    }

    setShowSplitBurnPlan(true);
    setBurnPlanError("");
  };

  // Calculate split exercises when burn plan is shown
  useEffect(() => {
    if (showSplitBurnPlan && nutritionData) {
      if (selectedExercises.length === 0) {
        setBurnPlanError("Please select at least one exercise to see your split burn plan.");
        setSplitExercises([]);
        return;
      }

      const totalCalories = calculateTotal('calories');
      if (totalCalories <= 0) {
        setBurnPlanError("Please calculate nutrition data first.");
        setSplitExercises([]);
        return;
      }
      
      const userWeight = parseFloat(weight);
      const effectiveWeight = (userWeight > 0) ? userWeight : 70;

      const split = calculateSplitExercises(selectedExercises, totalCalories, effectiveWeight);
      setSplitExercises(split);
      setBurnPlanError("");
    } else {
      setSplitExercises([]);
      setBurnPlanError("");
    }
  }, [selectedExercises, nutritionData, showSplitBurnPlan, weight]);

  // Scroll to burn plan section when shown
  useEffect(() => {
    if (showSplitBurnPlan && burnPlanSectionRef.current) {
      setTimeout(() => {
        burnPlanSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [showSplitBurnPlan]);

  return (
    <div className="calorie-calculator-container">
      <div className="calculator-card">
        <h1 className="main-title">Custom Food Calculator</h1>
        <form onSubmit={handleCalculate} className="input-form">
          {/* Main food query input */}
          <input
            type="text"
            className="input-field"
            placeholder="e.g., 1 big mac combo, 200g steak, 100g spinach"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            // --- START OF CHANGES ---
            disabled={loading}
            className={`calculate-button ${loading ? 'loading-button' : ''}`}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      </div>

      {/* --- START OF CHANGES --- */}
      {/* Conditionally render the loading state OR the results/error */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analyzing your food items...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {nutritionData && (
            <div ref={resultRef} className="results-card">
              <h2 className="summary-title">Nutrition Summary</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-value">
                    {calculateTotal('calories').toFixed(1)}
                  </div>
                  <div className="summary-label">Calories</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">
                    {calculateTotal('protein_g').toFixed(1)}g
                  </div>
                  <div className="summary-label">Protein</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">
                    {calculateTotal('carbohydrates_g').toFixed(1)}g
                  </div>
                  <div className="summary-label">Carbs</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">
                    {calculateTotal('fat_g').toFixed(1)}g
                  </div>
                  <div className="summary-label">Fat</div>
                </div>
              </div>
              
              <h3 className="breakdown-title">Itemized Breakdown</h3>
              <ul className="breakdown-list">
                {nutritionData.map((item, index) => (
                  <li key={index} className="breakdown-item">
                    <span className="food-name">{item.food}</span>
                    <div className="nutrition-values">
                      {item.calories ? (
                        <>
                          <span>{item.calories.toFixed(1)} cal</span>
                          <span>{item.protein_g.toFixed(1)}g P</span>
                          <span>{item.carbohydrates_g.toFixed(1)}g C</span>
                          <span>{item.fat_g.toFixed(1)}g F</span>
                        </>
                      ) : (
                        <span className="not-found">Not Found</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exercise Selection Section - Only show when nutrition data is available */}
          {nutritionData && (
            <>
              <ExerciseSelector
                onSelect={handleExerciseSelect}
                selected={selectedExercises}
              />

              {/* New weight input container with label */}
              <div className="weight-input-container">
                <label htmlFor="weight-input">Please Enter Your Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  className="input-field"
                  placeholder="e.g., 85"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  max="300"
                />
              </div>

              {/* Burn Plan Button */}
              <button
                onClick={handleViewBurnPlan}
                className="cta-button"
                style={{
                  background: "var(--color-orange-fluorescent)",
                  color: "black",
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                  transition: "all 2s ease-out",
                }}
              >
                {showSplitBurnPlan ? "Hide Burn Plan" : "View Burn Plan"}
              </button>

              {/* Burn Plan Error Display */}
              {burnPlanError && (
                <p
                  style={{
                    color: "var(--color-orange-fluorescent)",
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                  }}
                >
                  {burnPlanError}
                </p>
              )}

              {/* Split Burn Plan Section */}
              {showSplitBurnPlan && (
                <div ref={burnPlanSectionRef}>
                  <SplitBurnPlan
                    splitExercises={splitExercises}
                    totalCalories={calculateTotal('calories')}
                    selectedExercises={selectedExercises}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
      {/* --- END OF CHANGES --- */}
    </div>
  );
}