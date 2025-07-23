// scripts/calculateSplitExercises.js (corrected to ensure SplitBurnPlan shows results)

import { calculateExercises } from "./exercise.js";

/**
 * Divides total calories evenly across selected exercises and calculates required reps/minutes.
 * @param {string[]} selectedExercises - Exercises chosen by the user.
 * @param {number} totalCalories - Total calories to split.
 * @param {number} weight - User weight in kg.
 * @returns {{ name: string, value: number, unit: string, img: string }[]} Array of calculated exercises.
 */
export function calculateSplitExercises(selectedExercises, totalCalories, weight) {
  if (!selectedExercises.length || totalCalories <= 0 || weight <= 0) return [];

  const caloriesPerExercise = totalCalories / selectedExercises.length;
  const allExercises = calculateExercises(caloriesPerExercise, weight);

  // Correct filtering to handle partial matches (e.g., "Push-ups" vs "Push-ups (vigorous)")
  return allExercises.filter(ex => {
    return selectedExercises.some(sel => ex.name.toLowerCase().includes(sel.toLowerCase()));
  });
}
