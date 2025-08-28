// File: AiCalorieCalculator.jsx

import { useState, useRef } from 'react';
import '../stylesheets/ai-calorie-converter.css'; // Import the dedicated CSS file

/**
 * AiCalorieCalculator is a React component that calculates
 * nutritional information from natural language input using the Gemini API.
 */
export default function AiCalorieCalculator() {
  const [query, setQuery] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Reference to automatically scroll to results after API response
  const resultRef = useRef(null);

  /**
   * Fetches nutritional data from the Gemini API.
   * Uses exponential backoff for API retries to handle rate limiting.
   * @param {string} prompt The user's input string describing food items.
   * @param {number} retryCount The current retry attempt number.
   */
  const fetchNutritionData = async (prompt, retryCount = 0) => {
    setLoading(true);
    setError('');
    
    // Structured prompt engineering: requesting specific JSON format to ensure consistent parsing
    // This approach reduces API response variability and parsing errors
    const geminiPrompt = `Analyze the following food list and provide a detailed nutritional breakdown in a JSON array format. For each item, include the food name, total calories, protein in grams, carbohydrates in grams, and fats in grams. If a food item cannot be identified, return an object for that item with "not found" in the "food" field. The entire response must be a single JSON array, with keys in the following order: 'food', 'calories', 'protein_g', 'carbohydrates_g', 'fat_g'. Here is the list: ${prompt}`;

    // Gemini API payload with structured output configuration
    // responseMimeType and responseSchema enforce JSON format compliance
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
            // propertyOrdering ensures consistent key sequence in response
            "propertyOrdering": ["food", "calories", "protein_g", "carbohydrates_g", "fat_g"]
          }
        }
      }
    };
    
    // Environment variable integration: Secure API key management
    // Prevents hardcoded secrets in source code and enables different keys per environment
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Runtime validation: Ensure API key is configured before making requests
    // Provides clear error messaging for configuration issues
    if (!apiKey) {
      setLoading(false);
      setError('API key not configured. Please check your environment variables.');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Exponential backoff retry logic for rate limiting (429 status)
      // Delay increases exponentially: 1s, 2s, 4s for retries 0, 1, 2
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
      // Defensive programming: validate expected API response structure
      if (!result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts) {
        throw new Error('Unexpected API response structure.');
      }

      // Extract the JSON string from the nested API response structure
      const jsonText = result.candidates[0].content.parts[0].text;
      
      try {
        // Parse the AI-generated JSON and update state
        const data = JSON.parse(jsonText);
        setNutritionData(data);
        setLoading(false);
        // Auto-scroll to results for better UX after successful data fetch
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
   * Uses reduce with fallback for missing/null values to prevent calculation errors
   * @param {string} key The key to sum (e.g., 'calories').
   * @returns {number} The total sum.
   */
  const calculateTotal = (key) => {
    if (!nutritionData) return 0;
    // Reduce with null coalescing (|| 0) handles cases where API returns null/undefined values
    return nutritionData.reduce((sum, item) => sum + (item[key] || 0), 0);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchNutritionData(query);
    }
  };

  return (
    <div className="calorie-calculator-container">
      <div className="calculator-card">
        <h1 className="main-title">Custom Food Calculator</h1>
        <form onSubmit={handleCalculate} className="input-form">
          <input
            type="text"
            className="input-field"
            placeholder="e.g., 300g steak, 2 med potatoes, 100g spinach"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`calculate-button ${loading ? 'loading-button' : ''}`}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      </div>

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
                  {/* Conditional rendering: show nutrition data or "Not Found" message */}
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
    </div>
  );
}