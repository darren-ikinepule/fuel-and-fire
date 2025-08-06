// App.jsx - Fuel & Fire Application Core Logic
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import UI Components
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import FoodSelector from "./components/FoodSelector";
import UserInputForm from "./components/UserInputForm";
import ResultsDisplay from "./components/ResultsDisplay";
import SplitBurnPlan from "./components/SplitBurnPlan";
import ExerciseSelector from "./components/ExerciseSelector";
import IntroFuelAndFire from "./components/IntroFuelAndFire";
import MetChart from "./components/MetChart";
import SocialPage from "./components/SocialPage";
import NotFound from "./components/NotFound";


// Import Utility Functions
import { calculateSplitExercises } from "./scripts/calculateSplitExercises";

function App() {
  // State for user's weight
  const [user, setUser] = useState({ weight: "" });
  // State for selected food items from FoodSelector
  const [selectedFood, setSelectedFood] = useState([]);
  // State for exercises selected for the split burn plan
  const [selectedExercises, setSelectedExercises] = useState([]);
  // State for the calculated split exercises (duration per selected exercise)
  const [splitExercises, setSplitExercises] = useState([]);
  // State to control visibility of initial ResultsDisplay and ExerciseSelector
  const [showResults, setShowResults] = useState(false);
  // State to control visibility of the SplitBurnPlan
  const [showSplitBurnPlan, setShowSplitBurnPlan] = useState(false);
  // State for validation errors related to food/weight input
  const [validationError, setValidationError] = useState("");
  // State for validation errors specific to the split burn plan (e.g., no exercises selected)
  const [burnPlanError, setBurnPlanError] = useState("");
  // State to control the visibility of the ResultsDisplay content
  const [isResultsContentVisible, setIsResultsContentVisible] = useState(true); // Default to visible


  // Refs for scrolling to specific sections of the page
  const resultsSectionRef = useRef(null); // Ref for the ResultsDisplay section
  const burnPlanSectionRef = useRef(null); // Ref for the SplitBurnPlan section

  // Effect to scroll to the results section when it becomes visible
  useEffect(() => {
    if (showResults && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showResults]); // Dependency: runs when showResults state changes

  // Effect to calculate and scroll to the split burn plan when it becomes visible
  // This effect consolidates calculation and scrolling for the split plan.
  useEffect(() => {
    if (showSplitBurnPlan) {
      // Validate if exercises are selected and food/weight are valid before calculating
      if (selectedExercises.length === 0) {
        setBurnPlanError(
          "Please select at least one exercise to see your split burn plan."
        );
        setSplitExercises([]); // Clear previous split exercises if validation fails
        return;
      }
      if (
        selectedFood.length === 0 ||
        !user.weight ||
        Number(user.weight) <= 0
      ) {
        setBurnPlanError(
          "Please ensure you have selected food and entered a valid weight."
        );
        setSplitExercises([]);
        return;
      }

      const totalCalories = selectedFood.reduce(
        (sum, f) => sum + f.calories,
        0
      );
      // Calculate split exercises based on selected exercises, total calories, and user weight
      const split = calculateSplitExercises(
        selectedExercises,
        totalCalories,
        Number(user.weight)
      );
      setSplitExercises(split); // Update state with calculated split exercises
      setBurnPlanError(""); // Clear any previous burn plan errors

      // Scroll to the burn plan section after it's rendered and calculated
      // Using requestAnimationFrame for smoother synchronization with browser repaint
      requestAnimationFrame(() => {
        if (burnPlanSectionRef.current) {
          burnPlanSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    } else {
      setSplitExercises([]); // Clear split exercises if the plan is not visible
    }
  }, [selectedExercises, selectedFood, user.weight, showSplitBurnPlan]); // Dependencies: runs when these states change

  // Handler for selecting/deselecting exercises for the split plan
  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName) // Deselect if already selected
        : [...prev, exerciseName] // Select if not already selected
    );
  };

  // Handler for calculating the initial fuel burn workout
  const handleCalculate = (weightFromInputForm) => {
    // Reset previous errors and hide results/split plan
    setValidationError("");
    setBurnPlanError("");
    setShowResults(false);
    setShowSplitBurnPlan(false);
    setIsResultsContentVisible(true); // Ensure content is visible on new calculation

    // Input validation for weight
    if (
      !weightFromInputForm ||
      Number(weightFromInputForm) < 20 ||
      Number(weightFromInputForm) > 300
    ) {
      setValidationError(
        "Please enter a valid weight between 20–300 kg before calculating."
      );
      return;
    }
    // Input validation for food selection
    if (selectedFood.length === 0) {
      setValidationError(
        "Please select at least one food item before calculating."
      );
      return;
    }

    // Update user weight and show the results section
    setUser({ weight: weightFromInputForm });
    setShowResults(true); // This will trigger the useEffect for scrolling to results
  };

  // Handler for showing the split burn plan
  const handleViewBurnPlan = () => {
    // Validate if exercises are selected before showing the plan
    if (selectedExercises.length === 0) {
      setBurnPlanError(
        "Please select at least one exercise to view the burn plan."
      );
      setShowSplitBurnPlan(false); // Ensure plan is hidden if validation fails
      return;
    }
    setBurnPlanError(""); // Clear error if validation passes
    setShowSplitBurnPlan(true); // This will trigger the useEffect for calculating and scrolling
  };

  // Handler to toggle the visibility of ResultsDisplay content
  const toggleResultsContentVisibility = () => {
    setIsResultsContentVisible(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Layout component wraps all main application routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroFuelAndFire />} />
          <Route path="/met" element={<MetChart />} />
          <Route path="/social" element={<SocialPage />} />
          {/* Main calculator route */}
          <Route
            path="/calculator"
            element={
              <>
                {/* Food selection component */}
                <FoodSelector onSelect={setSelectedFood} />
                {/* User weight input form */}
                <UserInputForm
                  user={user}
                  onChange={setUser}
                  onSubmit={handleCalculate}
                />

                {/* Display validation errors for food/weight input */}
                {validationError && (
                  <p
                    style={{
                      color: "var(--color-orange-fluorescent)",
                      textAlign: "center",
                      marginTop: "1rem",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    }}
                  >
                    {validationError}
                  </p>
                )}

                {/* Conditional rendering for ResultsDisplay and ExerciseSelector */}
                {showResults && (
                  <div ref={resultsSectionRef}>
                    {/* UPDATED: Pass toggle state and function to ResultsDisplay */}
                    <ResultsDisplay
                      food={selectedFood}
                      user={user}
                      isContentVisible={isResultsContentVisible}
                      toggleContentVisibility={toggleResultsContentVisibility} // Pass the toggle function
                    />

                    {/* Exercise selection for split plan */}
                    <ExerciseSelector
                      onSelect={handleExerciseSelect}
                      selected={selectedExercises}
                    />

                    {/* Display burn plan specific errors */}
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

                    {/* Button to view the split burn plan, hidden if already shown */}
                    {!showSplitBurnPlan && (
                      <button
                        onClick={handleViewBurnPlan}
                        className="cta-button"
                        style={{
                          background: "var(--color-orange-fluorescent)",
                          color: "black",
                          textAlign: "center",
                          marginTop: "1rem",
                          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                          transition: "all 2s ease-out"
                        }}
                      >
                        View Burn Plan
                      </button>
                    )}
                  </div>
                )}

                {showSplitBurnPlan &&
                  splitExercises.length > 0 && ( // Only show if we have exercises to display
                    <div ref={burnPlanSectionRef}>
                      <SplitBurnPlan
                        splitExercises={splitExercises}
                        totalCalories={selectedFood.reduce(
                          (sum, f) => sum + f.calories,
                          0
                        )}
                        selectedExercises={selectedExercises}
                      />
                    </div>
                  )}
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
