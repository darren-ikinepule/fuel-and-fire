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
    
    // Using a more structured prompt for better AI output
    const geminiPrompt = `Analyze the following food list and provide a detailed nutritional breakdown in a JSON array format. For each item, include the food name, total calories, protein in grams, carbohydrates in grams, and fats in grams. If a food item cannot be identified, return an object for that item with "not found" in the "food" field. The entire response must be a single JSON array, with keys in the following order: 'food', 'calories', 'protein_g', 'carbohydrates_g', 'fat_g'. Here is the list: ${prompt}`;

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
    
    const apiKey = "AIzaSyAUw61Ta-bFJA8OMQGEIynl2ymVp-uzbjI";
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

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analyzing your food items...</p>
        </div>
      )}

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
    </div>
  );
}
