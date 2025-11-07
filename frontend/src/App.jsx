// App.jsx - Fuel & Fire Application Core Logic
import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy-load UI Components to reduce initial bundle size
import Layout from "./components/Layout.jsx";
import { calculateSplitExercises } from "./scripts/calculateSplitExercises.js";

const HomePage = lazy(() => import("./components/HomePage.jsx"));
const FoodSelector = lazy(() => import("./components/FoodSelector.jsx"));
const UserInputForm = lazy(() => import("./components/UserInputForm.jsx"));
const ResultsDisplay = lazy(() => import("./components/ResultsDisplay.jsx"));
const SplitBurnPlan = lazy(() => import("./components/SplitBurnPlan.jsx"));
const ExerciseSelector = lazy(() => import("./components/ExerciseSelector.jsx"));
const IntroFuelAndFire = lazy(() => import("./components/IntroFuelAndFire.jsx"));
const MetChart = lazy(() => import("./components/MetChart.jsx"));
const SocialPage = lazy(() => import("./components/SocialPage.jsx"));
const NotFound = lazy(() => import("./components/NotFound.jsx"));
const AiCalorieCalculator = lazy(() => import("./components/AiCalorieCalculator.jsx"));

const SectionFallback = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: "30vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      color: "var(--color-orange-fluorescent)",
      textAlign: "center",
      padding: "1.5rem",
    }}
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.9 }}
    >
      <circle cx="12" cy="12" r="10" style={{ opacity: 0.25 }} />
      <path d="M22 12c0-5.52-4.48-10-10-10">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
    <span style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}>{message}</span>
  </div>
);

const InlineFallback = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      textAlign: "center",
      padding: "1.25rem 0",
      color: "var(--color-orange-fluorescent)",
      fontSize: "clamp(0.9rem, 2.4vw, 1rem)",
    }}
  >
    {message}
  </div>
);

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

  const totalSelectedCalories = useMemo(
    () => selectedFood.reduce((sum, f) => sum + (f?.calories ?? 0), 0),
    [selectedFood]
  );

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
      // Call the utility function to split exercises and get the plan.
      const split = calculateSplitExercises(
        selectedExercises,
        totalSelectedCalories,
        Number(user.weight)
      );
      setSplitExercises(split);
      setBurnPlanError(""); // Clear any previous errors.
    } else {
      // Clear the burn plan when the user toggles it off.
      setSplitExercises([]);
      setBurnPlanError("");
    }
  }, [selectedExercises, totalSelectedCalories, user.weight, showSplitBurnPlan]);

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
            <Route
              path="/"
              element={
                <Suspense fallback={<SectionFallback message="Loading home..." />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/intro"
              element={
                <Suspense fallback={<SectionFallback message="Loading about page..." />}>
                  <IntroFuelAndFire />
                </Suspense>
              }
            />
            <Route
              path="/met"
              element={
                <Suspense fallback={<SectionFallback message="Loading MET chart..." />}>
                  <MetChart />
                </Suspense>
              }
            />
            <Route
              path="/social"
              element={
                <Suspense fallback={<SectionFallback message="Loading social links..." />}>
                  <SocialPage />
                </Suspense>
              }
            />
            <Route
              path="/aicaloriecalculator"
              element={
                <Suspense fallback={<SectionFallback message="Preparing custom calculator..." />}>
                  <AiCalorieCalculator />
                </Suspense>
              }
            />
          <Route
            path="/calculator"
            element={
                <Suspense fallback={<SectionFallback message="Loading calculator..." />}>
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
                        <Suspense fallback={<InlineFallback message="Preparing results..." />}>
                          <ResultsDisplay
                            food={selectedFood}
                            user={user}
                            isContentVisible={isResultsContentVisible}
                            toggleContentVisibility={toggleResultsContentVisibility}
                          />
                        </Suspense>

                        <Suspense fallback={<InlineFallback message="Loading exercises..." />}>
                          <ExerciseSelector
                            onSelect={handleExerciseSelect}
                            selected={selectedExercises}
                          />
                        </Suspense>

                        {/* Conditional rendering for the SplitBurnPlan. */}
                        {showSplitBurnPlan && (
                          <div ref={burnPlanSectionRef}>
                            <Suspense fallback={<InlineFallback message="Calculating burn plan..." />}>
                              <SplitBurnPlan
                                splitExercises={splitExercises}
                                totalCalories={totalSelectedCalories}
                                selectedExercises={selectedExercises}
                              />
                            </Suspense>
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
                </Suspense>
            }
          />
          {/* Fallback route for any unknown paths. */}
            <Route
              path="*"
              element={
                <Suspense fallback={<SectionFallback message="Loading page..." />}>
                  <NotFound />
                </Suspense>
              }
            />
        </Route>
      </Routes>
    </Router>
  );
}

// Export the App component for use in index.js.
export default App;
