// // Example: App.jsx
// import React, { useState } from "react";
// import HomePage from "./components/HomePage";
// import FoodSelector from "./components/FoodSelector";
// import ResultsDisplay from "./components/ResultsDisplay";
// import UserInputForm from "./components/UserInputForm";
// import "./index.css"; // Ensure your global styles are imported here or in index.js
// import IntroFuelAndFire from "./components/IntroFuelAndFire";
// import MetChart from "./components/MetChart";
// import SocialPage from "./components/SocialPage";





// function App() {
//   const [user, setUser] = useState({ weight: "" });
//   const [selectedFood, setSelectedFood] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   const handleFormSubmit = () => {
//     setShowResults(true);
//   };

//   return (
//     <>
//       <HomePage/>
//       <IntroFuelAndFire/>
//       <MetChart/>
//       <FoodSelector onSelect={setSelectedFood} />
//       <UserInputForm
//         user={user}
//         onChange={setUser}
//         onSubmit={handleFormSubmit}
//       />
//       {showResults && <ResultsDisplay food={selectedFood} user={user} />}
//       <SocialPage/>
     
//     </>
//   );
// }

// export default App;

// App.jsx
// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import FoodSelector from "./components/FoodSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import UserInputForm from "./components/UserInputForm";
import IntroFuelAndFire from "./components/IntroFuelAndFire";
import MetChart from "./components/MetChart";
import SocialPage from "./components/SocialPage";
import NotFound from "./components/NotFound";

function App() {
  const [user, setUser] = useState({ weight: "" });
  const [selectedFood, setSelectedFood] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = () => {
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
                <UserInputForm
                  user={user}
                  onChange={setUser}
                  onSubmit={handleFormSubmit}
                />
                {showResults && <ResultsDisplay food={selectedFood} user={user} />}
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
