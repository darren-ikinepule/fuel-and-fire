// File: AiCalorieCalculator.jsx

import { useState, useRef, useEffect } from 'react';
import '../stylesheets/ai-calorie-converter.css';
import ExerciseSelector from './ExerciseSelector.jsx';
import SplitBurnPlan from './SplitBurnPlan.jsx';
import { calculateSplitExercises } from '../scripts/calculateSplitExercises.js';
import { getStandardizedFood, STANDARDIZED_FOODS } from '../scripts/standardized-foods.js';

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
   * Parses user input to extract food items and quantities
   * Handles patterns like "3x big mac", "1 big mac three times", "big mac three times", etc.
   * @param {string} input - User input string
   * @returns {Array} - Array of {quantity, foodName} objects
   */
  const parseFoodInput = (input) => {
    const items = [];
    const trimmedInput = input.trim();
    
    // Number words mapping
    const numberWords = { 
      one: 1, two: 2, three: 3, four: 4, five: 5, 
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      once: 1, twice: 2
    };
    
    // Pattern 1: "3 big mac" (number at start) - CHECK THIS FIRST!
    // Simple pattern: number followed by space and food name
    const numberFirstPattern = /^(\d+)\s+(.+)$/i;
    let numberMatch = trimmedInput.match(numberFirstPattern);
    
    if (numberMatch && numberMatch.length >= 3 && numberMatch[2]) {
      const quantity = parseInt(numberMatch[1], 10);
      let foodName = String(numberMatch[2]).trim();
      
      // Ensure foodName is not empty and quantity is valid
      if (foodName && foodName.length > 0 && quantity > 0 && !isNaN(quantity)) {
        // Create multiple entries for the same item
        for (let i = 0; i < quantity; i++) {
          items.push({ quantity: 1, foodName });
        }
        return items;
      }
    }
    
    // Pattern 2: "1 big mac three times" or "big mac three times"
    const timesPattern = /(?:(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+)?(.+?)\s+(?:(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+)?times?$/i;
    let timesMatch = trimmedInput.match(timesPattern);
    
    if (timesMatch) {
      // Extract the quantity (either before or after the food name)
      const quantityBefore = timesMatch[1] ? (numberWords[timesMatch[1].toLowerCase()] || parseInt(timesMatch[1])) : 1;
      const quantityAfter = timesMatch[3] ? (numberWords[timesMatch[3].toLowerCase()] || parseInt(timesMatch[3])) : 1;
      const quantity = quantityAfter > 1 ? quantityAfter : quantityBefore;
      const foodName = timesMatch[2].trim();
      
      // Create multiple entries for the same item
      for (let i = 0; i < quantity; i++) {
        items.push({ quantity: 1, foodName });
      }
      return items;
    }
    
    // Pattern 3: "3x big mac" or "big mac x3" (must have 'x' or 'X')
    const xPattern = /(?:(\d+)\s*x\s*(.+?))|(?:(.+?)\s+x\s*(\d+))/i;
    let xMatch = trimmedInput.match(xPattern);
    
    if (xMatch) {
      let quantity, foodName;
      if (xMatch[1] && xMatch[2]) {
        // "3x big mac"
        quantity = parseInt(xMatch[1], 10);
        foodName = xMatch[2].trim();
      } else if (xMatch[3] && xMatch[4]) {
        // "big mac x3"
        quantity = parseInt(xMatch[4], 10);
        foodName = xMatch[3].trim();
      }
      
      if (quantity && foodName && quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          items.push({ quantity: 1, foodName });
        }
        return items;
      }
    }
    
    // Pattern 4: Split by commas, "and", "plus", etc.
    const parts = trimmedInput.split(/,|\s+and\s+|\s+plus\s+|\s+with\s+/i);
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      // Check for "three times" pattern in each part
      const partTimesMatch = trimmed.match(/(?:(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+)?(.+?)\s+(?:(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+)?times?$/i);
      
      if (partTimesMatch) {
        const qtyBefore = partTimesMatch[1] ? (numberWords[partTimesMatch[1].toLowerCase()] || parseInt(partTimesMatch[1])) : 1;
        const qtyAfter = partTimesMatch[3] ? (numberWords[partTimesMatch[3].toLowerCase()] || parseInt(partTimesMatch[3])) : 1;
        const qty = qtyAfter > 1 ? qtyAfter : qtyBefore;
        const foodName = partTimesMatch[2].trim();
        
        for (let i = 0; i < qty; i++) {
          items.push({ quantity: 1, foodName });
        }
        continue;
      }
      
      // Check for number at start of part
      const partNumberMatch = trimmed.match(/^(\d+)\s+(.+)$/);
      if (partNumberMatch) {
        const quantity = parseInt(partNumberMatch[1]);
        const foodName = partNumberMatch[2].trim();
        for (let i = 0; i < quantity; i++) {
          items.push({ quantity: 1, foodName });
        }
        continue;
      }
      
      // Single item
      items.push({ quantity: 1, foodName: trimmed });
    }
    
    return items.length > 0 ? items : [{ quantity: 1, foodName: trimmedInput }];
  };

  /**
   * Fetches nutritional data from the Gemini API with strict consistency requirements.
   * Uses standardized database when possible to ensure identical results.
   * @param {string} prompt The user's input string describing food items.
   * @param {number} retryCount The current retry attempt number.
   */
  const fetchNutritionData = async (prompt, retryCount = 0) => {
    setError('');
    
    // First, try to parse and use standardized database
    const parsedItems = parseFoodInput(prompt);
    const standardizedResults = [];
    const itemsNeedingAPI = [];
    
    for (const item of parsedItems) {
      // Ensure foodName is valid and not truncated
      const foodName = String(item.foodName || '').trim();
      
      if (!foodName || foodName.length === 0) {
        console.warn('Skipping item with empty food name:', item);
        continue;
      }
      
      const standardized = getStandardizedFood(foodName);
      if (standardized) {
        // Format food name for display (capitalize first letter of each word)
        const formatFoodName = (name) => {
          if (!name || typeof name !== 'string' || name.length === 0) {
            return name;
          }
          return name
            .split(' ')
            .filter(word => word.length > 0) // Remove empty strings
            .map(word => {
              if (word.length === 0) return word;
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
        };
        
        // Use the original foodName for display, not the normalized one
        const displayName = formatFoodName(foodName);
        
        // Ensure we have a valid display name
        const finalDisplayName = (displayName && displayName.length > 0) 
          ? displayName 
          : ((foodName && foodName.length > 0) ? foodName : 'Unknown Item');
        
        // Use standardized value - ensures consistency
        standardizedResults.push({
          food: finalDisplayName,
          calories: standardized.calories,
          protein_g: standardized.protein_g,
          carbohydrates_g: standardized.carbohydrates_g,
          fat_g: standardized.fat_g
        });
      } else {
        itemsNeedingAPI.push(item);
      }
    }
    
    // If all items were standardized, return immediately
    if (itemsNeedingAPI.length === 0 && standardizedResults.length > 0) {
      setNutritionData(standardizedResults);
      setLoading(false);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Build prompt for items needing API lookup
    const apiPrompt = itemsNeedingAPI.map(item => item.foodName).join(', ');
    
    // CRITICAL: Use strict prompt with temperature=0 to ensure consistency
    const geminiPrompt = `You are an expert nutritional data engine. Your ONLY function is to provide accurate, verified calorie counts and macronutrients for restaurant items.

**PRIMARY CONSTRAINT:** Always use globally accepted, standardized average nutritional data for the requested item. Do NOT introduce variation based on location or minor recipe differences. Use OFFICIAL nutritional data from restaurant chains when available.

**CRITICAL CONSISTENCY RULE:** If the same item is requested multiple times, you MUST return IDENTICAL values each time. For example:
- "Big Mac (McDonald's)" = ALWAYS 550 calories, 25g protein, 45g carbs, 33g fat
- "Large McDonald's Fries" = ALWAYS 510 calories, 6g protein, 66g carbs, 24g fat

**STANDARDIZED VALUES FOR COMMON ITEMS:**
- Big Mac (McDonald's): 550 calories, 25g protein, 45g carbs, 33g fat
- Quarter Pounder with Cheese (McDonald's): 520 calories, 26g protein, 42g carbs, 26g fat
- Large Fries (McDonald's): 510 calories, 6g protein, 66g carbs, 24g fat
- McChicken (McDonald's): 400 calories, 14g protein, 39g carbs, 22g fat
- Filet-O-Fish (McDonald's): 390 calories, 15g protein, 38g carbs, 19g fat

**PACIFIC ISLAND FOODS:** For Pacific Island foods (chop suey, lu sipi, povi masima, oka, palusami, sapasui, panipopo, fa'ausi, koko rice, umu kai), use traditional preparation methods and typical ingredient combinations.

**OUTPUT FORMAT:** Return ONLY a valid JSON array. Each object must have EXACTLY these keys in this order: 'food', 'calories', 'protein_g', 'carbohydrates_g', 'fat_g'.

**IMPORTANT:** 
- Use EXACT values from official sources
- Do NOT approximate or round inconsistently
- If you cannot identify an item, return {"food": "not found", "calories": 0, "protein_g": 0, "carbohydrates_g": 0, "fat_g": 0}

**Input food items:** ${apiPrompt}

Return ONLY the JSON array, no other text.`

    const payload = {
      contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0, // CRITICAL: Set to 0 for maximum consistency
        topP: 0.1, // Low value for deterministic responses
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
    
    if (!apiKey) {
      setLoading(false);
      setError('Gemini API key not found. Please check your environment variables.');
      throw new Error('Gemini API key not found. Please check your environment variables.');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

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
        const apiData = JSON.parse(jsonText);
        
        // Combine standardized results with API results
        const combinedData = [...standardizedResults];
        
        // Add API results, ensuring they match the parsed items
        if (Array.isArray(apiData)) {
          combinedData.push(...apiData);
        } else if (apiData.food) {
          combinedData.push(apiData);
        }
        
        // If we have standardized results, use those; otherwise use API results
        const finalData = standardizedResults.length > 0 ? combinedData : apiData;
        
        setNutritionData(finalData);
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