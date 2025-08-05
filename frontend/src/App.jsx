// App.jsx
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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


import { calculateSplitExercises } from "./scripts/calculateSplitExercises";

function App() {
  const [user, setUser] = useState({ weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [splitExercises, setSplitExercises] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSplitBurnPlan, setShowSplitBurnPlan] = useState(false);
  const [validationError, setValidationError] = useState(""); // For initial food/weight validation
  const [burnPlanError, setBurnPlanError] = useState(""); // For split burn plan specific validation

  const resultsSectionRef = useRef(null);
  const burnPlanSectionRef = useRef(null);

  // Effect to scroll to results when showResults becomes true
  useEffect(() => {
    if (showResults && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showResults]);

  // === NEW/MODIFIED: Effect to calculate split exercises dynamically ===
  useEffect(() => {
    // Only calculate if the Split Burn Plan is intended to be shown
    if (showSplitBurnPlan) {
      if (selectedExercises.length === 0) {
        setBurnPlanError(
          "Please select at least one exercise to see your split burn plan."
        );
        setSplitExercises([]); // Clear previous split exercises
        return;
      }
      if (
        selectedFood.length === 0 ||
        !user.weight ||
        Number(user.weight) <= 0
      ) {
        // This case should ideally be caught by handleCalculate before showResults,
        // but adding a safeguard here.
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
      const split = calculateSplitExercises(
        selectedExercises,
        totalCalories,
        Number(user.weight)
      );
      setSplitExercises(split);
      setBurnPlanError(""); // Clear error if calculation is successful

      // The scrolling logic is no longer here
    } else {
      setSplitExercises([]); // Clear split exercises if plan is not visible
    }
  }, [selectedExercises, selectedFood, user.weight, showSplitBurnPlan]); // Dependencies

  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
    // Note: burnPlanError will be handled by the useEffect above
  };

  const handleCalculate = (weightFromInputForm) => {
    setValidationError("");
    setBurnPlanError("");
    setShowResults(false);
    setShowSplitBurnPlan(false); // Hide split plan on new calculation

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
    if (selectedFood.length === 0) {
      setValidationError(
        "Please select at least one food item before calculating."
      );
      return;
    }
    // Update user state. This will trigger the relevant useEffects.
    setUser({ weight: weightFromInputForm });
    setShowResults(true);
  };

  // UPDATED: The function now scrolls to the bottom of the page
  const handleViewBurnPlan = () => {
    if (selectedExercises.length === 0) {
      setBurnPlanError(
        "Please select at least one exercise to view the burn plan."
      );
      setShowSplitBurnPlan(false);
      return;
    }
    setBurnPlanError(""); // Clear error if validation passes
    setShowSplitBurnPlan(true); // Show the plan, useEffect will calculate
    
    // Smoothly scroll to the very bottom of the page
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }, 100); // A small delay to ensure the content has been rendered
  };

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroFuelAndFire />} />
          <Route path="/met" element={<MetChart />} />
          <Route path="/social" element={<SocialPage />} />
          <Route
            path="/calculator"
            element={
              <>
                <FoodSelector onSelect={setSelectedFood} />
                <UserInputForm
                  user={user}
                  onChange={setUser} // Ensure user.weight is updated via this prop
                  onSubmit={handleCalculate}
                />

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

                {showResults && (
                  <div ref={resultsSectionRef}>
                    <ResultsDisplay food={selectedFood} user={user} />

                    <ExerciseSelector
                      onSelect={handleExerciseSelect}
                      selected={selectedExercises}
                    />

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
                {/* Display burnPlanError even if splitExercises is empty, as long as showSplitBurnPlan is true */}
               
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