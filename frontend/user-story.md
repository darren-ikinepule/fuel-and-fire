## Fuel & Fire: Project Overview

Welcome to the core details of "Fuel & Fire," the app designed to ignite your fitness awareness with a sleek, edgy, and sporty vibe!

## Problem Statement

Many people find it hard to grasp how much exercise is needed to burn off fast-food calories, creating a gap between their eating habits and fitness goals or just general curiosity.
Fuel & Fire solves this by visually translating fast-food consumption into relatable exercise, making calorie awareness fun and motivating.

## Wow-Factor

The wow-factor of Fuel & Fire lies in its ability to instantly transform abstract calorie counts into relatable, real-world exercise challenges, presented with a visually striking and motivating interface.

## Test-users

Beck
Kombe
Victor
Evan

## feed back form
https://forms.gle/bP35sxB9JdkyCjy78

## User Stories & Acceptance Criteria

## User Story 1: Food Selection & Calorie Display

As a user, I want to easily select one or more fast-food items from a visually appealing list, so that I can see their combined calorie count.

## Acceptance Criteria:

On the food selection screen, clicking a fast-food item visually indicates that it is selected (e.g., with an orange border/glow).
Clicking a selected item again should deselect it.
As I select/deselect items, the total calorie count for the selected items should update dynamically and be clearly displayed.
The food items should be presented with their image, name, and individual calorie count.

## User Story 2: Personalized Exercise Calculation

As a user, I want to input my weight, so that the app can accurately calculate personalized exercise durations needed to burn off the selected calories.

## Acceptance Criteria:

After selecting one or more fast-food items, entering my weight (in kg) and submitting it should display a list of different exercises (e.g., running, walking, cycling) with the specific duration required for each, based on my weight and the total calories.
The exercise results should be clearly formatted and easy to understand.
If no food is selected or weight is not entered, an informative message should prompt me to do so before displaying results.

## User Story 3: Engaging Visual Feedback

As a user, I want the app to provide a visually engaging and consistent experience, so that I feel motivated and enjoy using it.

## Acceptance Criteria:

All elements (backgrounds, headings, borders, interactive states) should consistently adhere to the gloss black and fluorescent orange theme.
The overall aesthetic should convey an edgy and sporty feel through its design choices (e.g., strong contrasts, subtle glows, bold typography).
Interactive elements (buttons, selected food items) should provide clear visual feedback on hover, focus, and selection.

## User Story 4: Responsive Layout

As a user, I want the app to look good and be fully functional on various devices, so that I can use it comfortably whether on my phone or desktop.

## Acceptance Criteria:

On a mobile device (e.g., phone portrait/landscape), all content should be appropriately sized and laid out without horizontal scrolling.
On a tablet or desktop, the layout should adapt to utilize the screen space effectively, maintaining readability and usability.

## User Story 5: Intuitive Impact Understanding (Non-Numerical User)

As someone who doesn't understand complex numbers or fitness terms, I want to easily grasp the physical effort needed to balance out my fast-food choices, so that I can make simple, positive decisions for my health.

## Acceptance Criteria:

When I select a food item
Instead of precise calorie numbers, the app should suggest easy-to-understand physical activities (e.g., "a brisk walk","jogging","swimming") and their approximate duration, without showing exact minutes or precise MET values initially.
The app should offer encouraging, non-technical feedback that reinforces positive choices.

## Fuel & Fire: Ignite Your Wellness
## Introduction
Good morning, everyone! My name is Darren and today I'm thrilled to introduce you to Fuel & Fire, a web application designed to help you visualize the relationship between the food you consume and the exercise required to burn those calories. It's a fun, interactive tool to empower users with a clearer understanding of their energy balance.

The Core Experience: Fueling Up, Burning Bright
At the heart of Fuel & Fire is the Calculator page, where the magic happens.

1. Fueling Up: Food Selection
User-Friendly Interface: I've designed the food selection process to be incredibly user-friendly. Users can easily browse and select various fast-food items.

Instant Feedback: As you select food items, the app immediately updates the total calorie count, giving you a clear picture of your energy intake.

Visual Engagement: Each food item comes with a clear image and its calorie value, making the selection process engaging and easy to understand.

2. Personalizing Your Burn: Your Weight Matters
Customized Calculations: After selecting your food, the app prompts you to enter your weight. This is a crucial step because calorie burn during exercise is highly dependent on body weight. Fuel & Fire uses this input to provide truly personalized exercise recommendations.

3. Igniting the Fire: Dynamic Exercise Recommendations (The "Wow" Feature!)
Instant Workout Plan: Once you've selected your food and entered your weight, a single click on "Calculate Fuel Burn" instantly generates a list of exercises and their durations required to burn off those calories. This is a real "wow" moment – seeing tangible exercise equivalents for your meal!

Variety is Key: The app doesn't just give you one option; it provides a range of common exercises like running, cycling, swimming, and more. This empowers users to choose activities they enjoy.

Smooth Transitions: We've put a lot of effort into making the user experience seamless. When you click "Calculate Fuel Burn," the page smoothly scrolls down to display your personalized workout, ensuring you always land exactly where you need to be.

4. Splitting the Burn: Ultimate Flexibility
Multi-Exercise Plan: This is another significant "wow" feature! After viewing your initial workout, you can choose to "View Burn Plan." This allows you to select multiple exercises and then the app dynamically splits the total calorie burn across your chosen activities.

Real-time Updates: As you select or deselect exercises in the split plan, the durations for each activity update in real-time. This provides incredible flexibility for users to create a diversified workout that fits their preferences.

Seamless Scrolling: Just like with the initial calculation, selecting exercises in the split plan also triggers a smooth scroll to ensure the updated "Your Split Burn Plan" is always perfectly in view, no matter how many exercises you add or remove.

The Science Behind the App: How We Got Our Info
Calorie Data
The calorie information for the food items is pre-defined within the application. For a real-world scenario, this data would typically be sourced from a robust food database API. For this project, we've curated a selection of common items to demonstrate the app's functionality. It's important to note that these values are approximate, as indicated in our disclaimer.

MET Table and Exercise Calculations
Metabolic Equivalents (METs): The core of our exercise calculations relies on the concept of Metabolic Equivalents, or METs. A MET is a ratio of your working metabolic rate relative to your resting metabolic rate. For example, an activity with a MET value of 3 means you're expending three times the energy you would at rest.

Precise Calculations: We use a standard formula that takes into account the MET value of an activity, the user's weight, and the total calories to be burned, to accurately determine the duration required for each exercise.

Transparency with the MET Table: The app includes a dedicated Met Table page. This feature allows users to explore the MET values for various activities, providing transparency and educating them on how different exercises contribute to calorie expenditure. It's a great resource for understanding the science behind the recommendations.

Beyond the Calculator: Special Features & User-Friendliness
Dynamic and Interesting Navigation
React Router: We've implemented react-router-dom to create a dynamic and seamless single-page application experience. Users can navigate between the Home, Calculator, Met Table, About, and Social pages without full page reloads, making the app feel fast and modern.

Intuitive Layout: The navigation bar is clear and responsive, adapting well to different screen sizes, ensuring a user-friendly experience on any device.

User-Friendly Design
Clean Aesthetics: The app boasts a clean, modern design with a consistent color palette that enhances readability and visual appeal.

Clear Messaging: Validation errors and instructions are presented clearly and concisely, guiding the user through the process without confusion.

Professionalism & Future Vision
Disclaimer: We've included a clear disclaimer emphasizing that calorie and exercise values are approximate. This demonstrates a professional and responsible approach to data presentation.

Scalability: The architecture of Fuel & Fire is designed with scalability in mind. It can easily be expanded to include a wider range of food items, more exercises, user accounts for tracking progress, and even integration with fitness wearables in the future.

Social Integration: The "Social" page is a placeholder for future features that could allow users to share their burn plans, challenge friends, or connect with a community, fostering a more engaging and motivating experience.

Conclusion
Fuel & Fire is more than just a calculator; it's a tool for awareness and empowerment. By visually connecting food intake with exercise, we aim to inspire healthier choices and make fitness more approachable. Thank you for your time, and I'm happy to answer any questions you may have!