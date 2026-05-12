import React, { useState } from 'react';
import '../stylesheets/decider.css';

// --- OPTIONS & DATA ---



// 1. Workout Decider Options
const WORKOUT_OPTIONS = [
  'Burpees (3 sets of 10)', 
  'Push-Ups (Max Reps)', 
  'Jumping Jacks (60 seconds)', 
  'High Knees (45 seconds)',
  'Squats (3 sets of 15)',
  'Plank (60 seconds)',
  'Mountain Climbers (45 seconds)',
  'Crunches (3 sets of 20)',
  'Lunges (10 per leg)',
  'Tricep Dips (3 sets of 12)',
  'Wall Sit (60 seconds)',
  'Box Jumps (3 sets of 10)',
  'Leg Raises (3 sets of 15)',
  'Supermans (3 sets of 12)',
  'Side Plank (30 seconds per side)',
  'Navy Seal Burpees (3 sets of 5)', 
  'Hindu Pushups (3 sets of 10)',
  'Tuck Jumps (3 sets of 10)',
  'Pistol Squats (3 sets of 5 per leg)'
];



// 2. Travel Decider Options
const TRAVEL_OPTIONS = ['Walk', 'Bike', 'Drive', 'Bus', 'Run'];

// Travel SVG Icons
const TRAVEL_ICONS = {
  'Walk': (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="2" r="1"></circle>
      <path d="M12 9v5"></path>
      <path d="M9 12h6"></path>
      <path d="M12 14l-3 5"></path>
      <path d="M12 14l3 5"></path>
    </svg>
  ),
  'Bike': (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="17" r="3"></circle>
      <circle cx="18" cy="17" r="3"></circle>
      <polyline points="9 17 12 14 15 17"></polyline>
      <path d="M12 14v-4"></path>
    </svg>
  ),
  'Drive': (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="10" rx="2"></rect>
      <circle cx="8" cy="17" r="2"></circle>
      <circle cx="16" cy="17" r="2"></circle>
      <line x1="6" y1="7" x2="6" y2="5"></line>
      <line x1="18" y1="7" x2="18" y2="5"></line>
    </svg>
  ),
  'Bus': (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h8"></path>
      <rect x="3" y="6" width="18" height="12" rx="2"></rect>
      <circle cx="7" cy="18" r="1.5"></circle>
      <circle cx="17" cy="18" r="1.5"></circle>
      <path d="M3 12h18"></path>
    </svg>
  ),
  'Run': (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="3" r="1.5"></circle>
      <path d="M12 8v3"></path>
      <path d="M9 10l-2 5"></path>
      <path d="M15 10l2 5"></path>
      <path d="M9 13v5"></path>
      <path d="M15 13v5"></path>
    </svg>
  )
};

// 3. Food Decider Options
const FOOD_OPTIONS = [
  'Pizza (Any)', 'Burger King', 'McDonald\'s', 'KFC', 'Starbucks',
  'Chinese Takeout', 'Vietnamese Pho', 'Italian Pasta', 'Thai Curry',
  'Japanese Sushi', 'Indian Cuisine', 'Mexican Tacos', 'Greek Gyros',
  'Korean BBQ', 'Mediterranean Food', 'Fried Chicken', 'Steakhouse',
  'Seafood Grill', 'BBQ Ribs', 'Sandwiches/Deli', 'Soup & Salad',
  'Breakfast for Dinner', 'Home Cooking - Comfort', 'Local Diner', 
  'Something Healthy', 'Something Spicy', 'A New Place'
];


// 4. Simple Options (Coin Flip, Red/Black, & Yes/No)
const SIMPLE_OPTIONS = {
  'COIN_FLIP': ['Heads', 'Tails'],
  'RED_OR_BLACK': ['Red', 'Black'],
  'YES_OR_NO': ['Yes', 'No']
};

// 5. Random Color Options
const COLOR_OPTIONS = [
  'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Gray', 'Cyan', 'Magenta'
];

// 6. Book or Movie Options
const MEDIA_OPTIONS = [
  'Read a Book', 'Watch a Movie'
];

// Define all possible decision modes
const DECISION_MODES = {
  WORKOUT: { id: 'WORKOUT', title: "Quick Workout", description: "No excuses! Decide your next exercise.", options: WORKOUT_OPTIONS, selectionRequired: false },
  FOOD: { id: 'FOOD', title: "What To Eat?", description: "Let fate choose your next meal.", options: FOOD_OPTIONS, selectionRequired: true },
  TRAVEL: { id: 'TRAVEL', title: "Travel Mode", description: "How should you get there?", options: TRAVEL_OPTIONS, selectionRequired: true },
  COIN_FLIP: { id: 'COIN_FLIP', title: "Coin Flip", description: "Heads or Tails.", options: SIMPLE_OPTIONS.COIN_FLIP, selectionRequired: false },
  RED_OR_BLACK: { id: 'RED_OR_BLACK', title: "Red or Black", description: "Bet on the color.", options: SIMPLE_OPTIONS.RED_OR_BLACK, selectionRequired: false },
  YES_OR_NO: { id: 'YES_OR_NO', title: "Yes or No", description: "Decide on a yes or no question.", options: SIMPLE_OPTIONS.YES_OR_NO, selectionRequired: false },
  COLOR: { id: 'COLOR', title: "Random Color", description: "Pick a random color.", options: COLOR_OPTIONS, selectionRequired: false },
  MEDIA: { id: 'MEDIA', title: "Book or Movie", description: "Decide your downtime.", options: MEDIA_OPTIONS, selectionRequired: false }
};

// The main application component
const Decider = () => {
  const [currentMode, setCurrentMode] = useState(null); 
  const [decision, setDecision] = useState(null);
  const [chosenModeId, setChosenModeId] = useState(null); 
  const [isDeciding, setIsDeciding] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const modeData = currentMode ? DECISION_MODES[currentMode] : null;

  // Function to toggle the selection state for Food/Travel modes
  const toggleSelection = (option) => {
    if (isDeciding) return;

    setDecision(null);
    setChosenModeId(null); 
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  // Function to handle all decisions
  const handleDecision = () => {
    if (isDeciding) return;

    setDecision(null);
    setChosenModeId(null);
    setIsDeciding(true);

    let listToChooseFrom = [];

    if (modeData.selectionRequired) {
      listToChooseFrom = selectedOptions;
      if (listToChooseFrom.length === 0) {
        setIsDeciding(false);
        console.error("Please select at least one option before deciding.");
        return;
      }
    } else {
      // For simple modes (Workout, Coin Flip, etc.), use the full predefined list
      listToChooseFrom = modeData.options;
    }

    // Simulate decision process
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * listToChooseFrom.length);
      const chosenResult = listToChooseFrom[randomIndex];
      setDecision(chosenResult);
      setChosenModeId(currentMode); 
      setIsDeciding(false);
    }, 1500); // Deciding delay
  };

  // Render the list of options for complex modes
  const renderOptionGrid = () => (
    <div className="options-grid">
      {modeData.options.map((option) => (
        <div 
          key={option} 
          className={`option-card ${selectedOptions.includes(option) ? 'selected' : 'deselected'} ${currentMode === 'TRAVEL' ? 'option-card-travel' : ''}`}
          onClick={() => toggleSelection(option)}
        >
          {/* Display travel icon for TRAVEL mode */}
          {currentMode === 'TRAVEL' && (
            <div className="travel-icon-container">{TRAVEL_ICONS[option]}</div>
          )}
          <span className="option-label">{option}</span>
        </div>
      ))}
    </div>
  );

  // Render the main menu of decision modes
  const renderModeMenu = () => (
    <div className="options-grid mode-selection-grid">
      {Object.values(DECISION_MODES).map((mode) => (
        <div 
          key={mode.id}
          className="mode-card"
          onClick={() => {
            setCurrentMode(mode.id);
            setSelectedOptions([]); 
            setDecision(null);
            setChosenModeId(null);
          }}
        >
          <h3 className="mode-title">{mode.title}</h3>
          <p className="mode-desc">{mode.description}</p>
          <span className="mode-action">Select</span>
        </div>
      ))}
    </div>
  );

  // Helper function to render content in the result box
  const renderResultContent = () => {
    if (!currentMode) {
      return <p className="result-placeholder">Select a Decision Mode to begin!</p>;
    }
    
    if (isDeciding) {
      if (currentMode === 'COIN_FLIP') {
        return (
          <>
            <div className="coin-flip-animation">
              <div className="coin"></div> 
            </div>
            <p className="result-placeholder" style={{ marginTop: '20px' }}>Flipping the Coin of Destiny...</p>
          </>
        );
      }
      
      // Default spinner for other modes
      return (
        <>
          <div className="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
          <p className="result-placeholder" style={{ marginTop: '10px' }}>Deciding...</p>
        </>
      );
    }

    if (decision) {
      // Special handling for COIN_FLIP mode - show a visual coin
      if (chosenModeId === 'COIN_FLIP') {
        return (
          <div className="coin-result-container">
            <div className={`coin-visualization ${decision.toLowerCase()}`}>
              <div className="coin-inner">
                <span className="coin-text">{decision === 'Heads' ? 'H' : 'T'}</span>
              </div>
            </div>
            <p className="coin-label">{decision}</p>
          </div>
        );
      }
      
      // Use chosenModeId to handle dynamic color background for RED_OR_BLACK and COLOR modes
      const resultClass = `result-text result-text-${chosenModeId.toLowerCase().replace(/_/g, '-')}`;
      
      // If COLOR mode, render the text in black/white on the dynamic background color
      const isColorMode = chosenModeId === 'COLOR';
      const textColorStyle = isColorMode ? { 
        color: decision === 'Yellow' || decision === 'Cyan' ? 'var(--color-text-dark)' : 'var(--color-text-light)' 
      } : {};
      
      return <p className={resultClass} style={textColorStyle}>{decision}</p>;
    }

    if (modeData.selectionRequired && selectedOptions.length === 0) {
      return <p className="result-placeholder error-text">Click on the options above you are open to, then press the 'Decide' button.</p>;
    }

    return <p className="result-placeholder">Click 'Decide for Me!'</p>;
  };

  // Check if the decision button should be disabled
  const isButtonDisabled = isDeciding || (modeData && modeData.selectionRequired && selectedOptions.length === 0);

  // Dynamic class for the result box
  let resultBoxClass = 'result-box';
  if (chosenModeId === 'RED_OR_BLACK' && decision) {
    resultBoxClass += ` ${decision.toLowerCase()}`;
  } else if (chosenModeId === 'COLOR' && decision) {
    resultBoxClass += ` color-result-${decision.toLowerCase().replace(/\s/g, '')}`;
  }

  return (
    <div className="decider-container">
      <header className="header">
        <h1 className="header-title">{currentMode ? modeData.title : "Ultimate Decision Selector"}</h1>
      </header>
      
      {/* Back Button */}
      {currentMode && (
        <button 
          className="nav-button back-to-menu-button" 
          onClick={() => {
            setCurrentMode(null);
            setDecision(null);
            setChosenModeId(null);
            setSelectedOptions([]);
          }}
          disabled={isDeciding}
        >
          &larr; Back to Modes
        </button>
      )}

      {/* Main Content Area */}
      {currentMode ? (
        <>
          {/* Description for simple modes */}
          {!modeData.selectionRequired && (
            <div className="mode-description-box">
              <p className="mode-desc-text">
                {modeData.id === 'WORKOUT' ? 'Get ready! You will be doing this for 3 sets/rounds, or as many reps as possible.' : modeData.description}
              </p>
            </div>
          )}

          {/* Options Grid (for Food/Travel) */}
          {modeData.selectionRequired && renderOptionGrid()}

          {/* Decision Button */}
          <button 
            className="main-button final-decide-button" 
            onClick={handleDecision}
            disabled={isButtonDisabled}
          >
            {isDeciding 
              ? 'Deciding...' 
              : modeData.selectionRequired
                ? `Decide from ${selectedOptions.length} Option${selectedOptions.length !== 1 ? 's' : ''}`
                : `Decide for Me!`
            }
          </button>
        </>
      ) : (
        /* Mode Selection Menu */
        renderModeMenu()
      )}

      {/* Result Display Box */}
      <div className={resultBoxClass}>
        {renderResultContent()}
      </div>
    </div>
  );
};

export default Decider;

