// App.jsx - Fuel & Fire Application Core Logic
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import UI Components
import Layout from "./components/Layout.jsx";
import HomePage from "./components/HomePage.jsx";
import FoodSelector from "./components/FoodSelector.jsx";
import UserInputForm from "./components/UserInputForm.jsx";
import ResultsDisplay from "./components/ResultsDisplay.jsx";
import SplitBurnPlan from "./components/SplitBurnPlan.jsx";
import ExerciseSelector from "./components/ExerciseSelector.jsx";
import IntroFuelAndFire from "./components/IntroFuelAndFire.jsx";
import MetChart from "./components/MetChart.jsx";
import SocialPage from "./components/SocialPage.jsx";
import NotFound from "./components/NotFound.jsx";

// Import Utility Functions
import { calculateSplitExercises } from "./scripts/calculateSplitExercises.js";
import AiCalorieCalculator from "./components/AiCalorieCalculator.jsx";

function App() {
  // useState hooks for managing the application's state.
  // user: stores user's weight.
  // selectedFood: array of food items chosen by the user.
  // selectedExercises: array of exercise names chosen for the burn plan.
  // splitExercises: the calculated burn plan with reps/minutes for each exercise.
  // showResults, showSplitBurnPlan: boolean flags to control UI visibility.
  // validationError, burnPlanError: strings to hold and display error messages.
  const [user, setUser] = useState({ weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [splitExercises, setSplitExercises] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSplitBurnPlan, setShowSplitBurnPlan] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [burnPlanError, setBurnPlanError] = useState("");
  const [isResultsContentVisible, setIsResultsContentVisible] = useState(true);

  // useRef hooks to get direct access to DOM elements for scrolling.
  const resultsSectionRef = useRef(null);
  const burnPlanSectionRef = useRef(null);

  // useEffect hook to handle scrolling to the results section.
  // It triggers whenever `showResults` changes to true.
  useEffect(() => {
    if (showResults && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showResults]);

  // useEffect hook to calculate and display the split burn plan.
  // It runs when `showSplitBurnPlan`, `selectedExercises`, `selectedFood`, or `user.weight` change.
  useEffect(() => {
    if (showSplitBurnPlan) {
      // Input validation for the burn plan calculation.
      if (selectedExercises.length === 0) {
        setBurnPlanError("Please select at least one exercise to see your split burn plan.");
        setSplitExercises([]); // Clear previous results
        return;
      }
      if (selectedFood.length === 0 || !user.weight || Number(user.weight) <= 0) {
        setBurnPlanError("Please ensure you have selected food and entered a valid weight.");
        setSplitExercises([]); // Clear previous results
        return;
      }

      // Calculate the total calories from the selected food items.
      const totalCalories = selectedFood.reduce((sum, f) => sum + f.calories, 0);
      // Call the utility function to split exercises and get the plan.
      const split = calculateSplitExercises(
        selectedExercises,
        totalCalories,
        Number(user.weight)
      );
      setSplitExercises(split);
      setBurnPlanError(""); // Clear any previous errors.
    } else {
      // Clear the burn plan when the user toggles it off.
      setSplitExercises([]);
      setBurnPlanError("");
    }
  }, [selectedExercises, selectedFood, user.weight, showSplitBurnPlan]);

  // useEffect hook to scroll to the SplitBurnPlan section.
  // A timeout is used to ensure the component has rendered before attempting to scroll.
  useEffect(() => {
    if (showSplitBurnPlan && burnPlanSectionRef.current) {
      setTimeout(() => {
        burnPlanSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showSplitBurnPlan]);

  // Handler for selecting/deselecting exercises in the ExerciseSelector component.
  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName) // Deselect if already in the array
        : [...prev, exerciseName] // Select if not in the array
    );
  };

  // Handler for the main "Calculate" button.
  // It performs validation and then shows the results.
  const handleCalculate = (weightFromInputForm) => {
    // Reset all state related to results and errors.
    setValidationError("");
    setBurnPlanError("");
    setShowResults(false);
    setShowSplitBurnPlan(false);
    setIsResultsContentVisible(true);

    // Validate the user's weight input.
    if (!weightFromInputForm || Number(weightFromInputForm) < 20 || Number(weightFromInputForm) > 300) {
      setValidationError("Please enter a valid weight between 20–300 kg before calculating.");
      return;
    }
    // Validate that at least one food item is selected.
    if (selectedFood.length === 0) {
      setValidationError("Please select at least one food item before calculating.");
      return;
    }

    // If validation passes, update state to show results.
    setUser({ weight: weightFromInputForm });
    setShowResults(true);
  };

  // Handler for the "View Burn Plan" button.
  // It performs a final validation check and then toggles the visibility of the burn plan.
  const handleViewBurnPlan = () => {
    if (!showSplitBurnPlan && selectedExercises.length === 0) {
      setBurnPlanError("Please select at least one exercise to view the burn plan.");
      return;
    }
    // Toggle the state to show or hide the SplitBurnPlan component.
    setShowSplitBurnPlan((prev) => !prev);
  };

  // Handler to toggle the visibility of the main ResultsDisplay content.
  const toggleResultsContentVisibility = () => {
    setIsResultsContentVisible((prev) => !prev);
  };

  // The main component render.
  // It uses React Router to handle different pages of the application.
  return (
    <Router>
      <Routes>
        {/* The Layout component provides a consistent header and footer for all pages. */}
        <Route element={<Layout />}>
          {/* Defines the routes for each page. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroFuelAndFire />} />
          <Route path="/met" element={<MetChart />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/aicaloriecalculator" element={<AiCalorieCalculator />} />
          <Route
            path="/calculator"
            element={
              <>
                {/* Renders the components for the main calculator page. */}
                <FoodSelector onSelect={setSelectedFood} />
                <UserInputForm user={user} onChange={setUser} onSubmit={handleCalculate} />

                {/* Conditional rendering of validation errors. */}
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

                {/* Conditional rendering for the results section. */}
                {showResults && (
                  <div ref={resultsSectionRef}>
                    <ResultsDisplay
                      food={selectedFood}
                      user={user}
                      isContentVisible={isResultsContentVisible}
                      toggleContentVisibility={toggleResultsContentVisibility}
                    />

                    <ExerciseSelector
                      onSelect={handleExerciseSelect}
                      selected={selectedExercises}
                    />

                    {/* Conditional rendering for the SplitBurnPlan. */}
                    {showSplitBurnPlan && (
                      <div ref={burnPlanSectionRef}>
                        <SplitBurnPlan
                          splitExercises={splitExercises}
                          totalCalories={selectedFood.reduce((sum, f) => sum + f.calories, 0)}
                          selectedExercises={selectedExercises}
                        />
                      </div>
                    )}

                    {/* Conditional rendering for burn plan errors. */}
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

                    {/* Button to toggle the burn plan visibility. */}
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
                  </div>
                )}
                
              </>
            }
          />
          {/* Fallback route for any unknown paths. */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Export the App component for use in index.js.
export default App;
