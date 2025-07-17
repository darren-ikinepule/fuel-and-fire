// ✅ Clean Modular Architecture for Your App
// 🔧 1. Folder Structure Suggestion
// Organize your files like this:

// css
// Copy
// Edit
// src/
// ├── components/
// │   ├── layout/
// │   │   ├── Layout.jsx
// │   │   └── Navbar.jsx
// │   ├── pages/
// │   │   ├── HomePage.jsx
// │   │   ├── CalculatorPage.jsx
// │   │   ├── IntroFuelAndFire.jsx
// │   │   ├── MetChart.jsx
// │   │   ├── SocialPage.jsx
// │   │   ├── NotFound.jsx
// │   └── shared/
// │       └── Footer.jsx
// ├── stylesheets/
// │   └── (your CSS files here)
// ├── scripts/
// │   └── (calculation logic, MET values, etc.)
// └── App.jsx
// ✂️ 2. Extract Navbar & Footer into Separate Components
// 🔹 Navbar.jsx
// jsx
// Copy
// Edit
// // components/layout/Navbar.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../stylesheets/home-page.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const handleNav = (path) => {
//     navigate(path);
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="navbar">
//       <a className="navbar-logo" onClick={() => handleNav("/")}>Fuel & Fire</a>
//       <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
//         <div className="hamburger-bar"></div>
//         <div className="hamburger-bar"></div>
//         <div className="hamburger-bar"></div>
//       </div>
//       <ul className="nav-links">
//         {["Home", "Calculator", "Met Table", "About", "Social"].map((text, i) => {
//           const path = ["/", "/calculator", "/met", "/intro", "/social"][i];
//           return (
//             <li key={text} className="nav-link">
//               <a onClick={() => handleNav(path)}>{text}</a>
//             </li>
//           );
//         })}
//       </ul>
//       <ul className={`mobile-nav-links ${isMenuOpen ? "active" : ""}`}>
//         {["Home", "Calculator", "Met Table", "About", "Social"].map((text, i) => {
//           const path = ["/", "/calculator", "/met", "/intro", "/social"][i];
//           return (
//             <li key={text} className="mobile-nav-link">
//               <a onClick={() => handleNav(path)}>{text}</a>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
// 🔹 Footer.jsx
// jsx
// Copy
// Edit
// // components/shared/Footer.jsx
// import React from "react";
// import "../../stylesheets/home-page.css";

// const Footer = () => (
//   <footer className="homepage-footer">
//     <p>&copy; 2025 Fuel & Fire. All rights reserved.</p>
//     <p className="disclaimer-text">
//       <span className="disclaimer-bold">Disclaimer:</span> Calorie and exercise values are approximate.
//     </p>
//   </footer>
// );

// export default Footer;
// 📦 3. Updated Layout.jsx
// jsx
// Copy
// Edit
// // components/layout/Layout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "../shared/Footer";

// const Layout = () => (
//   <div className="layout-container">
//     <Navbar />
//     <main className="main-content">
//       <Outlet />
//     </main>
//     <Footer />
//   </div>
// );

// export default Layout;
// 🔁 4. Create a Proper CalculatorPage Component
// This helps isolate the logic and makes routing cleaner.

// jsx
// Copy
// Edit
// // components/pages/CalculatorPage.jsx
// import React, { useState } from "react";
// import FoodSelector from "../FoodSelector";
// import UserInputForm from "../UserInputForm";
// import ResultsDisplay from "../ResultsDisplay";

// const CalculatorPage = () => {
//   const [user, setUser] = useState({ weight: "" });
//   const [selectedFood, setSelectedFood] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   const handleFormSubmit = () => {
//     setShowResults(true);
//   };

//   return (
//     <>
//       <FoodSelector onSelect={setSelectedFood} />
//       <UserInputForm user={user} onChange={setUser} onSubmit={handleFormSubmit} />
//       {showResults && <ResultsDisplay food={selectedFood} user={user} />}
//     </>
//   );
// };

// export default CalculatorPage;
// 🚀 5. Final App.jsx
// jsx
// Copy
// Edit
// // App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Layout from "./components/layout/Layout";
// import HomePage from "./components/pages/HomePage";
// import IntroFuelAndFire from "./components/pages/IntroFuelAndFire";
// import MetChart from "./components/pages/MetChart";
// import SocialPage from "./components/pages/SocialPage";
// import CalculatorPage from "./components/pages/CalculatorPage";
// import NotFound from "./components/pages/NotFound";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/intro" element={<IntroFuelAndFire />} />
//           <Route path="/met" element={<MetChart />} />
//           <Route path="/social" element={<SocialPage />} />
//           <Route path="/calculator" element={<CalculatorPage />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// ✅ Benefits of This Structure
// Clean separation of concerns: Layout, Pages, Shared Components

// Consistent global elements (navbar + footer)

// Reusability and easier testing

// Easier to scale: you can now easily add new routes/pages

// Let me know if you'd like help generating boilerplate code for each of the new files, or want me to audit any other specific component!