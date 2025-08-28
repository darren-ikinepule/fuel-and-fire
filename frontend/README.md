
## Fuel & Fire MVP — Technical Project Plan (Student-Friendly)

## Project Goal
Build a simple React-based web app that allows users to choose a fast food item from a list and see how much exercise (personalized by weight) they need to burn off the calories. The application will be a full-stack project, with a dedicated backend API.

1. ## Feature Breakdown (MVP Scope)
## Food Selector: 
A component (FoodSelector.jsx) that fetches and displays a list of food items from the backend API, allowing users to select one or more.

## User Input:
A simple form (UserInputForm.jsx) to collect the user's weight.

## Exercise Calculator:
A core script (exercise.js) that translates calories into various exercises based on weight.

## Results Display:
A component (ResultsDisplay.jsx) to show the total calorie count and multiple exercise options with time/reps estimates.

## Split Burn Plan:
 A component (SplitBurnPlan.jsx) that takes selected exercises and creates a detailed workout plan.

## Met Table:
 A component (MetChart.jsx) that displays a reference table of Metabolic Equivalent of Task (MET) values.

## AI Calorie Calculator:
 A component (AiCalorieCalculator.jsx) that uses an AI service to get nutritional data from natural language input.

## Basic UI:
 A responsive layout (Layout.jsx), readable design, and a dedicated 404 page (NotFound.jsx).

## Social Page:
 A simple page (SocialPage.jsx) for social media links.

2. ## Tech Stack
## Frontend:
 React (with Hooks, useState/useEffect), react-router-dom, modular CSS

## Backend:
 Node.js with Express, Mongoose (MongoDB ODM)

## Database:
 MongoDB (via MongoDB Atlas)

## Hosting (optional):
 Vercel (frontend), Render(backend)

3. ## Project Phases & Timeline
## Week 1–2: Planning & Setup
[ ] Finalize food list + calorie values

[ ] Research exercise equivalents per calorie for average users

[ ] Plan calorie → exercise logic formulas

[ ] Create wireframes (even simple sketches)

[ ] Set up React app and a Node.js backend (food-items.js) that connects to MongoDB.

[ ] Create and configure the .env file for the MONGODB_URI.

## Week 3–4: Core Feature Development
[ ] Build FoodSelector.jsx to fetch and display food data from the backend.

[ ] Create UserInputForm.jsx to collect user weight.

[ ] Build core exercise.js and calculateSplitExercises.js functions to compute exercise equivalents.

[ ] Implement ResultsDisplay.jsx and SplitBurnPlan.jsx to show the results clearly.

[ ] Integrate the frontend with the backend API to get food data and post user selections.

## Week 5: Polish & Test
[ ] Improve responsiveness and styling across all components.

[ ] Add error handling and basic validation.

[ ] Test with different user weights and food combos.

[ ] Verify that AiCalorieCalculator.jsx is functioning as expected.

[ ] Ensure all routes are working correctly, including the NotFound.jsx page.

## Week 6: Deployment & Wrap-up
[ ] Deploy frontend and backend.

[ ] Update the README.md to document the entire codebase, including all components and scripts.

[ ] Reflect on what you learned (React, full-stack architecture, UI).

4. ## Data You’ll Need
Fast Food List (10–20 items): Name, Calories per serving. This is served by the food-items.js backend.

Exercise Table or Formula: Calories burned per min/reps for:

Running

Walking

Cycling

Push-ups

...and more, as defined in exercise.js.

Default assumptions if user inputs are missing (e.g., average weight = 70kg).

5. ## Learning Goals Focus (React)
## Components:
 FoodSelector, ResultsDisplay, UserInputForm, MetChart, etc.

## State Management:
 useState for weight, selected food, and exercise results.

## Side Effects:
 useEffect to fetch food list from the backend and handle data changes.

## Props & Reusability:
 Result cards for each exercise type.

## Simple Routing:
 Using react-router-dom to navigate between the main pages (/, /calculator, /met, etc.).

## Full-Stack Integration:
 Connecting the React frontend to the Node.js/Express backend API.



## Fuel & Fire App
"Balance Your Indulgence with Activity."

Welcome to the Fuel & Fire app! This is a personal fast-food converter designed to help users understand the effort required to "burn off" their favorite indulgences. By providing simple, relatable exercise conversions, Fuel & Fire encourages a balanced and active lifestyle.

## Project Structure
The application is built using React and a simple, modular CSS approach for styling. The codebase is organized with separate components and CSS files for each main page, ensuring clarity and maintainability.

App.jsx: The main entry point of the application. It handles global setup and renders the appropriate page component using react-router-dom.

## components/:

## Layout.jsx: 
The main layout component that includes the navigation bar and footer.

## HomePage.jsx:
 The welcome screen with the app's mission and a "Get Started" button.

## UserInputForm.jsx:
 A form for users to input the food item they've consumed.

## FoodSelector.jsx:
 A component that allows users to select from a predefined list of food items.

## ExerciseCalculator.jsx:
 Displays a list of exercises and their durations to burn off the calories from the food item.

## ResultsDisplay.jsx:
 Renders the summary of the workout needed.

## SplitBurnPlan.jsx:
 Provides a detailed checklist and breakdown of a custom workout plan.

## MetChart.jsx:
 A reference page explaining Metabolic Equivalent of Task (MET) values.

## SocialPage.jsx:
 A placeholder page for social features like sharing progress and challenging friends.

## AiCalorieCalculator.jsx:
 A component that uses AI to get nutritional information from natural language input.

## NotFound.jsx:
 A simple 404 page for non-existent routes.

## backend/:
 food-items.js:
 A backend server built with Express and Mongoose to handle API requests for food item data from a MongoDB database.

## scripts/:
## exercise.js:
 Contains the core logic for calculating the calories burned for various exercises.

## calculateSplitExercises.js:
 A utility script that divides total calories evenly across a set of selected exercises.

## stylesheets/:
homepage.css, userinputform.css, exercisecalculator.css, socialpage.css: Dedicated CSS files for each component, making styling straightforward and easy to manage.

## Getting Started
To run this application on your local machine, you will need to have Node.js and npm installed.

## Clone the repository:

git clone https://github.com/darren-ikinepule/fuel-and-fire.git
cd fuel-and-fire-app

## Install dependencies:
npm install

## Set up Environment Variables:
This app requires a backend server that connects to a MongoDB database. You must create a .env file in the root directory of your project. This file is used to store sensitive information like your database URI, and it is automatically ignored by version control.

# .env file content
MONGODB_URI="your_mongodb_connection_string_here"

Replace "your_mongodb_connection_string_here" with your actual MongoDB connection string.

## Run the application:
To run both the frontend and backend, you'll need two terminal windows.

## Terminal 1 (Backend):
node backend/food-items.js

## Terminal 2 (Frontend):
npm run dev

The app will start on http://localhost:3000 by default.

## Design Philosophy
The app follows a consistent and visually appealing design language:

## Color Palette: 
A striking orange and black theme is used throughout for a high-contrast, energetic feel.

## Layout:
All pages use a responsive, centered card layout powered by Flexbox and simple CSS. This ensures a great user experience on both mobile and desktop devices.

## Styling:
All styling is done in separate, dedicated CSS files for each component. This avoids mixing logic and presentation, making the code cleaner and easier for a junior developer to understand and modify.

## Key Code Concepts
React Components: The app is broken down into functional components, which are reusable and stateful (where needed).

## Modular CSS:
Instead of a single large stylesheet, each component imports its own small CSS file. This is a common and effective way to manage styles in React.

## State Management:
The UserInputForm.jsx component demonstrates the use of the useState hook to manage the form's input value.

## Event Handling:
The app uses event handlers like onClick and onSubmit to respond to user interactions, such as clicking a button or submitting a form.

## Backend & APIs:
The food-items.js file uses Express to create a REST API and Mongoose to interact with a MongoDB database, demonstrating a full-stack application structure.
