export function calculateExercises(calories, weightKg) {
  const metValues = {
    "Running (8 km/h)": {
      met: 8.3,
      img: "https://cdn-icons-png.flaticon.com/128/1041/1041916.png",
    },
    "Jumping Jacks": {
      met: 8,
      img: "https://cdn-icons-png.flaticon.com/128/2965/2965567.png",
    },
    "Cycling (moderate)": {
      met: 7.5,
      img: "https://cdn-icons-png.flaticon.com/128/201/201818.png",
    },
    "Walking (brisk)": {
      met: 4.3,
      img: "/images/walking.jpeg",
    },
    "Swimming (moderate)": {
      met: 5.8, 
      img: "/images/swimming.jpeg",
    },
  };

  const results = [];
  
  Object.entries(metValues).forEach(([name, { met, img }]) => {
    const calPerMin = (met * weightKg * 3.5) / 200;
    const minutes = (calories / calPerMin).toFixed(1);
    if (name === "Jumping Jacks") {
      const reps = Math.round(minutes * 50);
      results.push({ name, value: reps, unit: "reps", img });
    } else {
      results.push({ name, value: minutes, unit: "minutes", img });
    }
  });

  //For Men: BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)+5
  //For Women: BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)−161

  return results;
}
