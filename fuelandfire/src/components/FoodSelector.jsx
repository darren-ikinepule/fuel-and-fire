import React from "react";
import "../stylesheets/food-selector.css";
import mcdonaldsInfo from "../scripts/burger-info"; 
import logo from "/images/mc-logo.jpeg"

function FoodSelector() {
    const foodOptions = mcdonaldsInfo;
    console.log(foodOptions)
  return (
    <>
        <div className="heading">
            <img className="logo-img" src={logo} alt="mc logo"></img>
            <div className="title"> 
                <h1>McDonalds</h1>
                <h3>Calories</h3>
            </div>
        </div>
      <div className="body-box">
        {foodOptions.map((food) => (
            <div className="burger-container">
          <img src={food.img} alt="food pic"></img>
          <h2>{food.name}</h2>
          <h4>Calories: {food.calories}</h4>
        </div>
        ))}
        

      </div>
    </>
  );
}
export default FoodSelector;

