// App.jsx (fixed validation display logic for Fuel & Fire)

import React, { useState, useEffect } from "react";
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
  const [validationError, setValidationError] = useState("");

  const handleExerciseSelect = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const handleCalculate = () => {
    const totalCalories = selectedFood.reduce((sum, f) => sum + f.calories, 0);

    if (!user.weight || Number(user.weight) < 20) {
      setValidationError("Please enter your weight before calculating.");
      setShowResults(false);
      return;
    }
    if (selectedFood.length === 0) {
      setValidationError("Please select at least one food item before calculating.");
      setShowResults(false);
      return;
    }
    if (selectedExercises.length === 0) {
      setValidationError("Please select at least one exercise before calculating.");
      setShowResults(false);
      return;
    }

    setValidationError("");
    const split = calculateSplitExercises(selectedExercises, totalCalories, Number(user.weight));
    setSplitExercises(split);
    setShowResults(true);
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
                <ExerciseSelector onSelect={handleExerciseSelect} selected={selectedExercises} />
                <UserInputForm
                  user={user}
                  onChange={setUser}
                  onSubmit={handleCalculate}
                  selectedExercises={selectedExercises}
                />
                {validationError && !showResults && (
                  <p style={{ color: 'var(--color-orange-fluorescent)', textAlign: 'center', marginTop: '1rem' }}>{validationError}</p>
                )}
                {showResults && (
                  <>
                    <ResultsDisplay food={selectedFood} user={user} />
                    <SplitBurnPlan
                      splitExercises={splitExercises}
                      totalCalories={selectedFood.reduce((sum, f) => sum + f.calories, 0)}
                      selectedExercises={selectedExercises}
                    />
                  </>
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
