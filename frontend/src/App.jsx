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
import './stylesheets/split-burn-plan.css';

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

  // Create refs for the sections
  const resultsSectionRef = useRef(null);
  const burnPlanSectionRef = useRef(null);

  // UseEffect to scroll to results when showResults becomes true
  useEffect(() => {
    if (showResults && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  // NEW USEEFFECT FOR BURN PLAN
  useEffect(() => {
    if (showSplitBurnPlan && burnPlanSectionRef.current) {
      burnPlanSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSplitBurnPlan]);


  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
    setBurnPlanError("");
  };

  const handleCalculate = (weightFromInputForm) => {
    setValidationError("");
    setBurnPlanError("");
    setShowResults(false);
    setShowSplitBurnPlan(false);

    if (!weightFromInputForm || Number(weightFromInputForm) < 20 || Number(weightFromInputForm) > 300) {
      setValidationError("Please enter a valid weight between 20–300 kg before calculating.");
      return;
    }
    if (selectedFood.length === 0) {
      setValidationError(
        "Please select at least one food item before calculating."
      );
      return;
    }

    setShowResults(true);
  };

  const handleViewBurnPlan = () => {
    setBurnPlanError("");

    if (selectedExercises.length === 0) {
      setBurnPlanError(
        "Please select at least one exercise to view the burn plan."
      );
      setShowSplitBurnPlan(false);
      return;
    }

    const totalCalories = selectedFood.reduce((sum, f) => sum + f.calories, 0);
    const split = calculateSplitExercises(
      selectedExercises,
      totalCalories,
      Number(user.weight)
    );
    setSplitExercises(split);
    setShowSplitBurnPlan(true);
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
                  onChange={setUser}
                  onSubmit={handleCalculate}
                  selectedExercises={selectedExercises}
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
                      >
                        View Burn Plan
                      </button>
                    )}
                  </div>
                )}

                {showSplitBurnPlan && (
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