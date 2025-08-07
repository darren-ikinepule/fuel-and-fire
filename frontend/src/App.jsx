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
  const [user, setUser] = useState({ weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [splitExercises, setSplitExercises] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSplitBurnPlan, setShowSplitBurnPlan] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [burnPlanError, setBurnPlanError] = useState("");
  const [isResultsContentVisible, setIsResultsContentVisible] = useState(true);

  const resultsSectionRef = useRef(null);
  const burnPlanSectionRef = useRef(null);

  // Scroll to results when shown
  useEffect(() => {
    if (showResults && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showResults]);

  // Calculate split burn plan when toggled
  useEffect(() => {
    if (showSplitBurnPlan) {
      if (selectedExercises.length === 0) {
        setBurnPlanError("Please select at least one exercise to see your split burn plan.");
        setSplitExercises([]);
        return;
      }
      if (selectedFood.length === 0 || !user.weight || Number(user.weight) <= 0) {
        setBurnPlanError("Please ensure you have selected food and entered a valid weight.");
        setSplitExercises([]);
        return;
      }

      const totalCalories = selectedFood.reduce((sum, f) => sum + f.calories, 0);
      const split = calculateSplitExercises(
        selectedExercises,
        totalCalories,
        Number(user.weight)
      );
      setSplitExercises(split);
      setBurnPlanError("");
    } else {
      setSplitExercises([]);
      setBurnPlanError("");
    }
  }, [selectedExercises, selectedFood, user.weight, showSplitBurnPlan]);

  // Scroll to SplitBurnPlan when shown
  useEffect(() => {
    // We'll use a timeout to ensure the DOM has rendered the new component before we scroll.
    if (showSplitBurnPlan && burnPlanSectionRef.current) {
      setTimeout(() => {
        burnPlanSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showSplitBurnPlan]);

  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const handleCalculate = (weightFromInputForm) => {
    setValidationError("");
    setBurnPlanError("");
    setShowResults(false);
    setShowSplitBurnPlan(false);
    setIsResultsContentVisible(true);

    if (!weightFromInputForm || Number(weightFromInputForm) < 20 || Number(weightFromInputForm) > 300) {
      setValidationError("Please enter a valid weight between 20–300 kg before calculating.");
      return;
    }
    if (selectedFood.length === 0) {
      setValidationError("Please select at least one food item before calculating.");
      return;
    }

    setUser({ weight: weightFromInputForm });
    setShowResults(true);
  };

  const handleViewBurnPlan = () => {
    // If we're about to show the plan, check for exercise selection
    if (!showSplitBurnPlan && selectedExercises.length === 0) {
      setBurnPlanError("Please select at least one exercise to view the burn plan.");
      return;
    }

    // Toggle the visibility state
    setShowSplitBurnPlan((prev) => !prev);
  };

  const toggleResultsContentVisibility = () => {
    setIsResultsContentVisible((prev) => !prev);
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
                <UserInputForm user={user} onChange={setUser} onSubmit={handleCalculate} />

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
                    {/* ResultsDisplay is no longer hidden by the split burn plan toggle */}
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

                    {showSplitBurnPlan && (
                      <div ref={burnPlanSectionRef}>
                        <SplitBurnPlan
                          splitExercises={splitExercises}
                          totalCalories={selectedFood.reduce((sum, f) => sum + f.calories, 0)}
                          selectedExercises={selectedExercises}
                        />
                      </div>
                    )}

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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
