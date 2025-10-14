export function calculateExercises(calories, weightKg) {
  // The metValues array is defined here for this standalone function.
  // In a larger application, it would typically be imported or passed as a prop.
  const metValues = {
    "Running (8 km/h)": {
      met: 8.3, // Verified: Consistent with moderate running.
      img: "https://placehold.co/128x128/000/FFF?text=RUN",
    },
    "Jumping Jacks": {
      met: 8.0, // High-intensity cardio exercise
      img: "https://placehold.co/128x128/000/FFF?text=JJ",
      repsPerMinute: "20-30 reps/min (slow-medium pace)",
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
    // Exercises converted from reps to minutes:
    "Push-ups (vigorous)": {
      met: 3.8, // Moderate to vigorous calisthenics
      img: "https://placehold.co/128x128/000/FFF?text=PUSH",
      repsPerMinute: "15-20 reps/min (slow-medium pace)",
    },
    "Burpees (moderate-vigorous)": {
      met: 8.0, // High-intensity bodyweight exercise
      img: "https://placehold.co/128x128/000/FFF?text=BURPEE",
      repsPerMinute: "10-15 reps/min (slow-medium pace)",
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
    "Make Love (Active, Vigorous Effort)": {
      met: 5.8, // General moderate effort activity
      img: "https://placehold.co/128x128/000/FFF?text=LOVE",
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
    let formattedValue = ""; // New variable for the formatted string
    const img = exerciseDetails.img; // Image is always present

    // Check if the exercise has a caloriesPerRep property (legacy support)
    if (exerciseDetails.caloriesPerRep !== undefined) {
      // Calculate repetitions for exercises like push-ups, burpees, and now Jumping Jacks
      value = Math.round(calories / exerciseDetails.caloriesPerRep);
      unit = "reps";
      formattedValue = value > 0 ? `${value} reps` : "0 reps";
    } else if (exerciseDetails.met !== undefined) {
      // Calculate time in minutes for MET-based exercises
      // Formula: Calories per minute = (MET * User Weight in kg * 3.5) / 200
      const caloriesPerMinute = (exerciseDetails.met * weightKg * 3.5) / 200;

      if (caloriesPerMinute > 0) {
        value = Math.round(calories / caloriesPerMinute); // Value is now rounded minutes
      } else {
        value = 0; // Avoid division by zero
      }
      unit = "minutes";

      // NEW: Logic to format minutes into hours and minutes
      const hours = Math.floor(value / 60);
      const remainingMinutes = value % 60;

      if (hours > 0 && remainingMinutes > 0) {
        // e.g., 1 hr 19 mins
        const hourLabel = hours === 1 ? "hr" : "hrs";
        const minuteLabel = remainingMinutes === 1 ? "min" : "mins";
        formattedValue = `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`;
      } else if (hours > 0 && remainingMinutes === 0) {
        // e.g., 2 hrs
        const hourLabel = hours === 1 ? "hr" : "hrs";
        formattedValue = `${hours} ${hourLabel}`;
      } else if (remainingMinutes > 0) {
        // e.g., 45 mins
        const minuteLabel = remainingMinutes === 1 ? "min" : "mins";
        formattedValue = `${remainingMinutes} ${minuteLabel}`;
      } else {
        // Case for 0 minutes
        formattedValue = "0 mins";
      }

    } else {
      // Fallback for any exercise definition that lacks both met and caloriesPerRep
      console.warn(
        `Exercise "${name}" has no 'met' or 'caloriesPerRep' defined.`
      );
      value = 0;
      unit = "N/A";
      formattedValue = "N/A";
    }

    // Push the calculated result
    results.push({
      name: name,
      value: value, // The numerical value is still available
      unit: unit,
      img: img,
      displayValue: formattedValue, // The new formatted string for display
      repsPerMinute: exerciseDetails.repsPerMinute || null, // Add reps per minute guidance if available
    });
  });

  return results;
}
