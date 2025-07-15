export function calculateExercises(calories, weightKg) {
  // The metValues array is defined here for this standalone function.
  // In a larger application, it would typically be imported or passed as a prop.
  const metValues = {
    "Running (8 km/h)": {
      met: 8.3, // Verified: Consistent with moderate running.
      img: "https://placehold.co/128x128/000/FFF?text=RUN",
    },
    "Jumping Jacks": {
      caloriesPerRep: 0.2, // Now calculated in reps
      img: "https://placehold.co/128x128/000/FFF?text=JJ",
    },
    "Cycling (moderate)": {
      met: 7.5, // Verified: Good average for moderate cycling.
      img: "https://placehold.co/128x128/000/FFF?text=CYCLE",
    },
    "Walking (brisk)": {
      met: 5.0, // Updated: More aligned with "very brisk" walking.
      img: "https://placehold.co/128x128/000/FFF?text=WALK",
    },
    "Swimming (moderate)": {
      met: 6.0, // Updated: General moderate swimming, slightly higher than breaststroke.
      img: "https://placehold.co/128x128/000/FFF?text=SWIM",
    },
    // Exercises with caloriesPerRep:
    "Push-ups (vigorous)": {
      caloriesPerRep: 0.3, // Based on vigorous calisthenics.
      img: "https://placehold.co/128x128/000/FFF?text=PUSH",
    },
    "Burpees (moderate-vigorous)": {
      caloriesPerRep: 0.5, // High-intensity bodyweight exercise.
      img: "https://placehold.co/128x128/000/FFF?text=BURPEE",
    },
    // Other MET-based exercises:
    "Hiking (moderate terrain)": {
      met: 5.0, // General moderate hiking.
      img: "https://placehold.co/128x128/000/FFF?text=HIKE",
    },
    "Skipping Rope (vigorous)": {
      met: 12.0, // High-intensity cardio.
      img: "https://placehold.co/128x128/000/FFF?text=SKIP",
    },
    "Dancing (moderate)": {
      met: 4.5, // General moderate dancing.
      img: "https://placehold.co/128x128/000/FFF?text=DANCE",
    },
    "Yoga (Hatha/General)": {
      met: 2.5, // Lower intensity, focus on flexibility and strength.
      img: "https://placehold.co/128x128/000/FFF?text=YOGA",
    },
    "Rowing Machine (moderate)": {
      met: 7.0, // Moderate effort on a rowing machine.
      img: "https://placehold.co/128x128/000/FFF?text=ROW",
    },
    "Stair Climbing (vigorous)": {
      met: 8.0, // Vigorous stair climbing.
      img: "https://placehold.co/128x128/000/FFF?text=STAIRS",
    },
    "Plank (isometric)": {
      met: 2.8, // Isometric exercise, lower calorie burn per minute.
      img: "https://placehold.co/128x128/000/FFF?text=PLANK",
    },
  };

  const results = [];

  // Ensure valid inputs for calculation
  if (calories <= 0 || weightKg <= 0) {
    return [];
  }

  // Iterate over each exercise definition in the object
  Object.entries(metValues).forEach(([name, exerciseDetails]) => {
    let value = 0;
    let unit = "";
    const img = exerciseDetails.img; // Image is always present

    // Check if the exercise has a caloriesPerRep property
    if (exerciseDetails.caloriesPerRep !== undefined) {
      // Calculate repetitions for exercises like push-ups, burpees, and now Jumping Jacks
      value = calories / exerciseDetails.caloriesPerRep;
      unit = "reps";
    } else if (exerciseDetails.met !== undefined) {
      // Calculate time in minutes for MET-based exercises
      // Formula: Calories per minute = (MET * User Weight in kg * 3.5) / 200
      const caloriesPerMinute = (exerciseDetails.met * weightKg * 3.5) / 200;

      if (caloriesPerMinute > 0) {
        value = calories / caloriesPerMinute;
        unit = "minutes";
      } else {
        value = 0; // Avoid division by zero
      }
    } else {
      // Fallback for any exercise definition that lacks both met and caloriesPerRep
      console.warn(
        `Exercise "${name}" has no 'met' or 'caloriesPerRep' defined.`
      );
      value = 0;
      unit = "N/A";
    }

    // Push the calculated result, rounded to the nearest whole number
    results.push({
      name: name,
      value: value > 0 && !isNaN(value) ? Math.round(value) : 0,
      unit: unit,
      img: img,
    });
  });

  return results;
}
