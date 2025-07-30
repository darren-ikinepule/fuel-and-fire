// App.jsx
import React, { useState } from "react"; // Removed useEffect and useRef imports
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

  // IMPORTANT: This function now accepts the weight directly from UserInputForm
  const handleCalculate = (weightFromInputForm) => {
    // Reset validation error and hide results at the beginning of each calculation attempt
    setValidationError("");
    setShowResults(false);

    const totalCalories = selectedFood.reduce((sum, f) => sum + f.calories, 0);

    // Use the weight passed directly from UserInputForm for immediate validation
    if (!weightFromInputForm || Number(weightFromInputForm) < 20 || Number(weightFromInputForm) > 300) {
      setValidationError("Please enter a valid weight between 20–300 kg before calculating.");
      return; // Stop execution if validation fails
    }
    if (selectedFood.length === 0) {
      setValidationError(
        "Please select at least one food item before calculating."
      );
      return; // Stop execution if validation fails
    }
    if (selectedExercises.length === 0) {
      setValidationError(
        "Please select at least one exercise before calculating."
      );
      return; // Stop execution if validation fails
    }

    // If all validations pass, then proceed with calculation and show results
    const split = calculateSplitExercises(
      selectedExercises,
      totalCalories,
      Number(weightFromInputForm) // Use the passed weight here
    );
    setSplitExercises(split);
    setShowResults(true); // Only set to true if all checks pass
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
                <ExerciseSelector
                  onSelect={handleExerciseSelect}
                  selected={selectedExercises}
                />
                <UserInputForm
                  user={user}
                  onChange={setUser}
                  onSubmit={handleCalculate} // Pass handleCalculate as the onSubmit prop
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
                  <>
                    <ResultsDisplay food={selectedFood} user={user} />
                    <SplitBurnPlan
                      splitExercises={splitExercises}
                      totalCalories={selectedFood.reduce(
                        (sum, f) => sum + f.calories,
                        0
                      )}
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