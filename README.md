

---

## ✅ Fuel & Fire MVP — Technical Project Plan (Student-Friendly)

### 🎯 Project Goal

Build a simple **React-based web app** that allows users to choose a junk food item from a list and see how much exercise (personalized by age and weight) they need to burn off the calories.

---

## 🧩 1. **Feature Breakdown (MVP Scope)**

| Feature                 | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Food Selector**       | Dropdown or list of static junk food items with their calorie counts                |
| **User Input**          | Simple form to collect age and weight                                               |
| **Exercise Calculator** | Function that translates calories into various exercises based on age/weight        |
| **Results Display**     | Show calorie count and multiple exercise options with time/reps estimates           |
| **Basic UI**            | Responsive layout, readable design (focus on React components and state management) |

---

## 🛠 2. **Tech Stack**

| Layer                  | Tech                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| **Frontend**           | React (with Hooks, useState/useEffect), basic CSS or styled-components |
| **Backend**            | Node.js with Express (serve static data, simple API endpoints)         |
| **Hosting (optional)** | Netlify (frontend), Render or Heroku (backend)                         |

---

## 📅 3. **Project Phases & Timeline**

### **Week 1–2: Planning & Setup**

* [ ] Finalize food list + calorie values
* [ ] Research exercise equivalents per calorie for average users
* [ ] Plan calorie → exercise logic formulas
* [ ] Create wireframes (even simple sketches)
* [ ] Set up React app + basic Node.js backend (use simple `express` server)

### **Week 3–4: Core Feature Development**

* [ ] Build food selector component in React
* [ ] Create form to input age + weight
* [ ] Build function to compute exercise equivalents
* [ ] Display results clearly (reusable UI components)
* [ ] Hook up frontend to backend to get food data

### **Week 5: Polish & Test**

* [ ] Improve responsiveness/styling
* [ ] Add error handling and basic validation
* [ ] Test with different user weights/ages and food combos

### **Week 6: Deployment & Wrap-up**

* [ ] Deploy frontend and backend
* [ ] Document the codebase
* [ ] Reflect on what you learned (React, architecture, UI)

---

## 📦 4. **Data You’ll Need**

* **Junk Food List (10–20 items)**: Name, Calories per serving
* **Exercise Table or Formula**: Calories burned per min/reps for:

  * Running
  * Walking
  * Cycling
  * Push-ups
* **Default assumptions** if user inputs are missing (e.g., average weight = 70kg, age = 25)

---

## 🎓 5. **Learning Goals Focus (React)**

| Skill                         | Feature to Practice                           |
| ----------------------------- | --------------------------------------------- |
| **Components**                | FoodList, ExerciseResults, UserInput          |
| **State Management**          | useState for age, weight, selected food       |
| **Side Effects**              | useEffect if you fetch food list from backend |
| **Props & Reusability**       | Result cards for each exercise type           |
| **Simple Routing (optional)** | If you separate input/results screens         |

---

