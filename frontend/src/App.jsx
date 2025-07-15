// Example: App.jsx
import React, { useState } from "react";
import FoodSelector from "./components/FoodSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import UserInputForm from "./components/UserInputForm";
import "./index.css"; // Ensure your global styles are imported here or in index.js
import IntroFuelAndFire from "./components/IntroFuelAndFire";
import MetChart from "./components/MetChart";

function App() {
  const [user, setUser] = useState({ weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = () => {
    setShowResults(true);
  };

  return (
    <>
      <IntroFuelAndFire/>
      <MetChart/>
      <FoodSelector onSelect={setSelectedFood} />
      <UserInputForm
        user={user}
        onChange={setUser}
        onSubmit={handleFormSubmit}
      />
      {showResults && <ResultsDisplay food={selectedFood} user={user} />}
    </>
  );
}

export default App;