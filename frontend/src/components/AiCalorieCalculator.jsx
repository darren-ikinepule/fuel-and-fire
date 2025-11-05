// File: AiCalorieCalculator.jsx

import { useState, useRef, useEffect } from 'react';
import '../stylesheets/ai-calorie-converter.css';
import ExerciseSelector from './ExerciseSelector.jsx';
import SplitBurnPlan from './SplitBurnPlan.jsx';
import { calculateSplitExercises } from '../scripts/calculateSplitExercises.js';
import { getStandardizedFood, STANDARDIZED_FOODS } from '../scripts/standardized-foods.js';
import { getComboItems, expandCombo } from '../scripts/food-combos.js';

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

    for (const item of parsedItems) {
      // Ensure foodName is valid and not truncated
      const foodName = String(item.foodName || '').trim();
      
      if (!foodName || foodName.length === 0) {
        console.warn('Skipping item with empty food name:', item);
        continue;
      }
      
      // Check if it's a combo first (before checking standardized foods)
      const combo = getComboItems(foodName);
      if (combo && combo.items && Array.isArray(combo.items) && combo.items.length > 0) {
        // Use combo items directly - they already have nutritional data
        // Repeat for quantity if needed
        const quantity = item.quantity || 1;
        for (let q = 0; q < quantity; q++) {
          combo.items.forEach((comboItem, index) => {
            // More defensive checks - ensure we have valid data
            if (comboItem) {
              const itemName = comboItem.name || `Item ${index + 1}`;
              const displayName = formatFoodName(itemName);
              
              // Ensure all nutritional values are numbers
              const itemData = {
                food: displayName || itemName,
                calories: Number(comboItem.calories) || 0,
                protein_g: Number(comboItem.protein_g) || 0,
                carbohydrates_g: Number(comboItem.carbohydrates_g) || 0,
                fat_g: Number(comboItem.fat_g) || 0
              };
              
              standardizedResults.push(itemData);
            }
          });
        }
        continue; // Skip to next parsed item - don't process as regular food
      }
      
      // Check if it's a standardized food item
      const standardized = getStandardizedFood(foodName);
      if (standardized) {
        const displayName = formatFoodName(foodName);
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
    
    // CRITICAL: Database-focused prompt with maximum consistency
    const geminiPrompt = `You are an expert, highly consistent nutritional data engine designed to operate as a single-use data retrieval tool for a caching layer.

**Core Instruction:** Your output must be used to populate a database. Therefore, the response must be absolutely consistent for the same input and adhere strictly to the JSON schema.

**PRIMARY CONSTRAINT:** Always use globally accepted, standardized average nutritional data for the requested item. Do NOT introduce variation based on location or minor recipe differences. Use OFFICIAL nutritional data from restaurant chains when available.

**FAST FOOD BRAND RECOGNITION:**
You MUST recognize items from all major fast food brands including but not limited to:
- McDonald's (McDonalds, Mc Donald's, etc.)
- KFC (Kentucky Fried Chicken, K.F.C., etc.)
- Burger King (BK, etc.)
- Subway
- Pizza Hut
- Starbucks
- Taco Bell
- Domino's
- Wendy's
- And other regional/national fast food chains

When a user mentions a brand name (e.g., "kfc lunch box", "mcdonald's big mac", "burger king whopper"), recognize it as a fast food item from that brand and use official nutritional data from that chain. If the exact item is not in the standardized list above, use your knowledge of official nutritional information from the restaurant's website or official sources.

**CRITICAL CONSISTENCY RULE:** If the same item is requested multiple times, you MUST return IDENTICAL values each time. For example:
- "Big Mac (McDonald's)" = ALWAYS 550 calories_kcal (INTEGER), 25.0 protein_grams (FLOAT), 33.0 fat_grams (FLOAT), 90 exercise_minutes_walking (INTEGER)
- "Large McDonald's Fries" = ALWAYS 510 calories_kcal (INTEGER), 6.0 protein_grams (FLOAT), 24.0 fat_grams (FLOAT), 83 exercise_minutes_walking (INTEGER)

**STANDARDIZED VALUES FOR COMMON ITEMS:**

**McDonald's:**
- Big Mac: 550 calories_kcal, 25.0 protein_grams, 33.0 fat_grams, 90 exercise_minutes_walking
- Quarter Pounder with Cheese: 520 calories_kcal, 26.0 protein_grams, 26.0 fat_grams, 85 exercise_minutes_walking
- Large Fries: 510 calories_kcal, 6.0 protein_grams, 24.0 fat_grams, 83 exercise_minutes_walking
- Medium Fries: 320 calories_kcal, 4.0 protein_grams, 15.0 fat_grams, 52 exercise_minutes_walking
- McChicken: 400 calories_kcal, 14.0 protein_grams, 22.0 fat_grams, 65 exercise_minutes_walking
- Filet-O-Fish: 390 calories_kcal, 15.0 protein_grams, 19.0 fat_grams, 64 exercise_minutes_walking
- Medium Coke: 210 calories_kcal, 0.0 protein_grams, 0.0 fat_grams, 34 exercise_minutes_walking

**KFC (Kentucky Fried Chicken):**
- Zinger Burger: 450 calories_kcal, 22.0 protein_grams, 22.0 fat_grams, 73 exercise_minutes_walking
- Original Recipe Chicken (1 piece): 320 calories_kcal, 20.0 protein_grams, 22.0 fat_grams, 52 exercise_minutes_walking
- 2-Piece Original Recipe Chicken: 480 calories_kcal, 28.0 protein_grams, 32.0 fat_grams, 78 exercise_minutes_walking
- Wicked Wings (3 piece): 350 calories_kcal, 18.0 protein_grams, 25.0 fat_grams, 57 exercise_minutes_walking
- Regular Fries: 280 calories_kcal, 3.0 protein_grams, 14.0 fat_grams, 46 exercise_minutes_walking
- Regular Pepsi: 150 calories_kcal, 0.0 protein_grams, 0.0 fat_grams, 24 exercise_minutes_walking
- KFC Lunch Box (1 piece chicken, fries, drink): 750 calories_kcal, 23.0 protein_grams, 36.0 fat_grams, 122 exercise_minutes_walking

**Subway:**
- Footlong BMT: 410 calories_kcal, 20.0 protein_grams, 14.0 fat_grams, 67 exercise_minutes_walking
- 6 inch BMT: 290 calories_kcal, 14.0 protein_grams, 10.0 fat_grams, 47 exercise_minutes_walking
- Cookie: 220 calories_kcal, 2.0 protein_grams, 10.0 fat_grams, 36 exercise_minutes_walking
- Regular Drink: 150 calories_kcal, 0.0 protein_grams, 0.0 fat_grams, 24 exercise_minutes_walking

**Burger King:**
- Whopper: 660 calories_kcal, 28.0 protein_grams, 40.0 fat_grams, 107 exercise_minutes_walking
- Medium Fries: 380 calories_kcal, 4.0 protein_grams, 18.0 fat_grams, 62 exercise_minutes_walking
- Chicken Nuggets (9 piece): 430 calories_kcal, 20.0 protein_grams, 25.0 fat_grams, 70 exercise_minutes_walking

**Starbucks:**
- Caffe Latte (Grande): 190 calories_kcal, 13.0 protein_grams, 7.0 fat_grams, 31 exercise_minutes_walking
- Blueberry Muffin: 350 calories_kcal, 5.0 protein_grams, 15.0 fat_grams, 57 exercise_minutes_walking

**Pizza Hut:**
- Large Pepperoni Pizza (per slice, 8 slices): 300 calories_kcal per slice, 14.0 protein_grams, 12.0 fat_grams, 49 exercise_minutes_walking per slice

**PACIFIC ISLAND FOODS:** For Pacific Island foods (chop suey, lu sipi, povi masima, oka, palusami, sapasui, panipopo, fa'ausi, koko rice, umu kai), use traditional preparation methods and typical ingredient combinations.

**EXERCISE CALCULATION:** Calculate exercise_minutes_walking for brisk walking (MET 5.0) at 70kg average weight. Formula: minutes = calories / ((5.0 * 70 * 3.5) / 200). Round to nearest integer.

**OUTPUT FORMAT:** Return ONLY a valid JSON array. Each object must have EXACTLY these keys in this order: 'food_item', 'calories_kcal', 'protein_grams', 'fat_grams', 'exercise_minutes_walking'.

**DATA TYPES:**
- food_item: STRING (standardized name for database key)
- calories_kcal: INTEGER (verified, globally standardized calorie count)
- protein_grams: FLOAT (protein content in grams)
- fat_grams: FLOAT (fat content in grams)
- exercise_minutes_walking: INTEGER (minutes of brisk walking, rounded to nearest minute)

**IMPORTANT:** 
- Use EXACT values from official sources (restaurant websites, official nutritional databases)
- Do NOT approximate or round inconsistently
- calories_kcal must be INTEGER
- exercise_minutes_walking must be INTEGER (rounded)
- For fast food items, ALWAYS try to find official nutritional data - do not return "not found" unless you are absolutely certain the item does not exist
- For combo meals (e.g., "lunch box", "combo", "meal"), break down into individual components if possible, or provide total nutritional values
- If you cannot identify an item after reasonable effort, return {"food_item": "not found", "calories_kcal": 0, "protein_grams": 0.0, "fat_grams": 0.0, "exercise_minutes_walking": 0}

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
              "food_item": { "type": "STRING" },
              "calories_kcal": { "type": "INTEGER" },
              "protein_grams": { "type": "NUMBER" },
              "fat_grams": { "type": "NUMBER" },
              "exercise_minutes_walking": { "type": "INTEGER" }
            },
            "propertyOrdering": ["food_item", "calories_kcal", "protein_grams", "fat_grams", "exercise_minutes_walking"],
            "required": ["food_item", "calories_kcal", "protein_grams", "fat_grams", "exercise_minutes_walking"]
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
        
        // Convert API response format to internal format
        // API returns: {food_item, calories_kcal, protein_grams, fat_grams, exercise_minutes_walking}
        // Internal needs: {food, calories, protein_g, carbohydrates_g, fat_g}
        const convertApiResponse = (apiItem) => {
          // Calculate carbohydrates from calories if not provided
          // Formula: carbs = (calories - (protein * 4) - (fat * 9)) / 4
          const calories = apiItem.calories_kcal || 0;
          const protein = apiItem.protein_grams || 0;
          const fat = apiItem.fat_grams || 0;
          const carbsFromCalculation = calories > 0 && (protein > 0 || fat > 0)
            ? Math.max(0, (calories - (protein * 4) - (fat * 9)) / 4)
            : 0;
          
          return {
            food: apiItem.food_item || 'Unknown',
            calories: calories,
            protein_g: protein,
            carbohydrates_g: carbsFromCalculation, // Calculated from calories
            fat_g: fat,
            // Store exercise minutes for potential future use
            exercise_minutes_walking: apiItem.exercise_minutes_walking || 0
          };
        };
        
        // Process API results
        let convertedApiData = [];
        if (Array.isArray(apiData)) {
          convertedApiData = apiData.map(convertApiResponse);
        } else if (apiData.food_item) {
          convertedApiData = [convertApiResponse(apiData)];
        }
        
        // Combine standardized results with converted API results
        const combinedData = [...standardizedResults, ...convertedApiData];
        
        // If we have standardized results, use combined; otherwise use converted API results
        const finalData = combinedData.length > 0 ? combinedData : convertedApiData;
        
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
                {(() => {
                  // Group identical items together
                  const groupedItems = [];
                  const itemMap = new Map();
                  
                  // First pass: group items by name
                  if (!nutritionData || !Array.isArray(nutritionData) || nutritionData.length === 0) {
                    return <li className="breakdown-item">No items to display</li>;
                  }
                  
                  nutritionData.forEach((item) => {
                    // Ensure item has required fields - be more lenient
                    if (!item) {
                      return;
                    }
                    
                    // Use food name or default to a fallback
                    const foodName = item.food || item.name || 'Unknown Item';
                    const key = foodName.toLowerCase();
                    
                    if (itemMap.has(key)) {
                      const existing = itemMap.get(key);
                      existing.count += 1;
                      existing.totalCalories += Number(item.calories) || 0;
                      existing.totalProtein += Number(item.protein_g) || 0;
                      existing.totalCarbs += Number(item.carbohydrates_g) || 0;
                      existing.totalFat += Number(item.fat_g) || 0;
                    } else {
                      itemMap.set(key, {
                        food: foodName,
                        count: 1,
                        calories: Number(item.calories) || 0,
                        protein_g: Number(item.protein_g) || 0,
                        carbohydrates_g: Number(item.carbohydrates_g) || 0,
                        fat_g: Number(item.fat_g) || 0,
                        totalCalories: Number(item.calories) || 0,
                        totalProtein: Number(item.protein_g) || 0,
                        totalCarbs: Number(item.carbohydrates_g) || 0,
                        totalFat: Number(item.fat_g) || 0,
                      });
                    }
                  });
                  
                  // Convert map to array
                  itemMap.forEach((groupedItem) => {
                    groupedItems.push(groupedItem);
                  });
                  
                  // If no grouped items, return a message
                  if (groupedItems.length === 0) {
                    return <li className="breakdown-item">No items found in breakdown</li>;
                  }
                  
                  // Helper function to convert plural to singular (simple approach)
                  const toSingular = (word) => {
                    // Common plural endings
                    if (word.endsWith('ies')) {
                      return word.slice(0, -3) + 'y';
                    }
                    if (word.endsWith('ches') || word.endsWith('shes') || word.endsWith('xes') || word.endsWith('zes')) {
                      return word.slice(0, -2);
                    }
                    if (word.endsWith('s') && !word.endsWith('ss') && word.length > 1) {
                      return word.slice(0, -1);
                    }
                    return word;
                  };

                  return groupedItems.map((item, index) => {
                    // Format food name: show quantity with singular form if count > 1
                    let displayName = item.food;
                    if (item.count > 1) {
                      // Try to convert to singular form
                      const words = item.food.split(' ');
                      const lastWord = words[words.length - 1];
                      const singularLastWord = toSingular(lastWord.toLowerCase());
                      
                      // Only convert if the singular form is different
                      if (singularLastWord !== lastWord.toLowerCase()) {
                        words[words.length - 1] = singularLastWord.charAt(0).toUpperCase() + singularLastWord.slice(1);
                        displayName = `${item.count} ${words.join(' ')}`;
                      } else {
                        // If singular conversion didn't work, use original format
                        displayName = `${item.count} ${item.food}`;
                      }
                    }
                    
                    return (
                      <li key={index} className="breakdown-item">
                        <span className="food-name">{displayName}</span>
                        <div className="nutrition-values">
                          {/* Show nutrition values even if calories is 0 (e.g., diet drinks) */}
                          {item.count > 1 ? (
                            <>
                              <span>{item.totalCalories.toFixed(1)} cal</span>
                              <span>{item.totalProtein.toFixed(1)}g P</span>
                              <span>{item.totalCarbs.toFixed(1)}g C</span>
                              <span>{item.totalFat.toFixed(1)}g F</span>
                            </>
                          ) : (
                            <>
                              <span>{item.calories.toFixed(1)} cal</span>
                              <span>{item.protein_g.toFixed(1)}g P</span>
                              <span>{item.carbohydrates_g.toFixed(1)}g C</span>
                              <span>{item.fat_g.toFixed(1)}g F</span>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  });
                })()}
                {/* Total Row - Show when there are multiple items OR when there's more than one entry */}
                {nutritionData.length > 0 && (
                  <li key="total" className="breakdown-item breakdown-total">
                    <span className="food-name total-label">Total</span>
                    <div className="nutrition-values">
                      <span>{calculateTotal('calories').toFixed(1)} cal</span>
                      <span>{calculateTotal('protein_g').toFixed(1)}g P</span>
                      <span>{calculateTotal('carbohydrates_g').toFixed(1)}g C</span>
                      <span>{calculateTotal('fat_g').toFixed(1)}g F</span>
                    </div>
                  </li>
                )}
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