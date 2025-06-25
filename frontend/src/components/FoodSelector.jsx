// import React, {useEffect} from "react";
// import fastFoodInfo from "../scripts/food-info";
// import logo from "/images/fuel&fire-logo.jpeg";
// import "../stylesheets/food-selector.css";

// function FoodSelector() {
//   const foodOptions = fastFoodInfo;
  
//   useEffect(() => {
   
//   }, []);
//   return (
//     <>
//       <div className="heading">
//         <img className="logo-img" src={logo} alt="mc logo"></img>
//       </div>
//       <div className="body-box">
//         {foodOptions.map((food) => (
//           <div className="burger-container" key={food.name}>
//             <img src={food.img} alt="food pic"></img>
//             <h2>{food.name}</h2>
//             <h4>Calories: {food.calories}</h4>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
// export default FoodSelector;

import React, { useState } from "react";
import fastFoodInfo from "../scripts/food-info";
import logo from "/images/fuel&fire-logo.jpeg";
import "../stylesheets/food-selector.css";

function FoodSelector({ onSelect }) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleSelect = (index) => {
    let newSelected;
    if (selectedIndices.includes(index)) {
      newSelected = selectedIndices.filter(i => i !== index);
    } else {
      newSelected = [...selectedIndices, index];
    }
    setSelectedIndices(newSelected);
    if (onSelect) {
      onSelect(newSelected.map(i => fastFoodInfo[i]));
    }
  };

  return (
    <>
      <div className="heading">
        <img className="logo-img" src={logo} alt="mc logo" />
      </div>
      <div className="food-selector">
        <div className="food-list">
          {fastFoodInfo.map((food, index) => (
            <div
              key={food.name}
              className={`food-item${selectedIndices.includes(index) ? " selected" : ""}`}
              onClick={() => handleSelect(index)}
              tabIndex={0}
              aria-label={food.name}
            >
              <img
                src={food.img}
                alt={food.name}
                className="food-img"
              />
              <div className="food-name">{food.name}</div>
              <div className="food-calories">{food.calories} cal</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FoodSelector;