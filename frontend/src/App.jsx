import React, { useState } from "react";
import FoodSelector from "./components/FoodSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import UserInputForm from "./components/UserInputForm";

function App() {
  const [user, setUser] = useState({ age: "", weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);

  return (
    <>
      <FoodSelector onSelect={setSelectedFood} />
      <UserInputForm user={user} onChange={setUser} />
      <ResultsDisplay food={selectedFood} user={user} />
    </>
  );
}

export default App;