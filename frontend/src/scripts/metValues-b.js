// src/data/metValues.js

export const metValues = [
  {
    name: "Running",
    metLight: 4.0, // e.g., very slow jog
    metModerate: 7.0, // e.g., jogging 6 mph
    metVigorous: 9.0, // e.g., running 7.5 mph
    img: "https://placehold.co/128x128/000/FFF?text=RUN"
  },
  {
    name: "Jumping Jacks",
    metLight: 3.5, // light effort
    metModerate: 6.0, // moderate effort
    metVigorous: 8.0, // vigorous effort
    img: "https://placehold.co/128x128/000/FFF?text=JJ"
  },
  {
    name: "Cycling",
    metLight: 3.5, // leisure, <10 mph
    metModerate: 6.0, // 10-11.9 mph, light effort
    metVigorous: 8.0, // 12-13.9 mph, moderate effort
    img: "https://placehold.co/128x128/000/FFF?text=CYCLE"
  },
  {
    name: "Walking",
    metLight: 2.5, // strolling, <2.0 mph
    metModerate: 5.0, // brisk, 3.5-4 mph
    metVigorous: 6.3, // very brisk, 4.5 mph
    img: "https://placehold.co/128x128/000/FFF?text=WALK"
  },
  {
    name: "Swimming",
    metLight: 3.0, // leisurely
    metModerate: 6.0, // moderate effort
    metVigorous: 8.0, // fast effort
    img: "https://placehold.co/128x128/000/FFF?text=SWIM"
  },
  {
    name: "Push-ups",
    metLight: 3.0, // light calisthenics
    metModerate: 5.0, // moderate calisthenics
    metVigorous: 8.0, // vigorous calisthenics
    img: "https://placehold.co/128x128/000/FFF?text=PUSH"
  },
  {
    name: "Burpees",
    metLight: 6.0, // very slow/modified (inherently vigorous activity, so 'light' is still high MET)
    metModerate: 8.0, // moderate pace
    metVigorous: 10.0, // vigorous pace
    img: "https://placehold.co/128x128/000/FFF?text=BURPEE"
  },
  {
    name: "Hiking",
    metLight: 3.0, // leisurely, flat
    metModerate: 5.0, // moderate terrain
    metVigorous: 7.0, // steep/heavy pack
    img: "https://placehold.co/128x128/000/FFF?text=HIKE"
  },
  {
    name: "Skipping Rope",
    metLight: 8.0, // slow pace (inherently vigorous activity)
    metModerate: 10.0, // moderate pace
    metVigorous: 12.0, // vigorous pace
    img: "https://placehold.co/128x128/000/FFF?text=SKIP"
  },
  {
    name: "Dancing",
    metLight: 3.0, // slow ballroom
    metModerate: 4.5, // moderate
    metVigorous: 6.0, // aerobic dancing
    img: "https://placehold.co/128x128/000/FFF?text=DANCE"
  },
  {
    name: "Yoga",
    metLight: 2.5, // Hatha/General
    metModerate: 3.5, // Flow/Vinyasa
    metVigorous: 5.0, // Power Yoga/Ashtanga (still moderate by general MET scale, but vigorous for yoga)
    img: "https://placehold.co/128x128/000/FFF?text=YOGA"
  },
  {
    name: "Weightlifting",
    metLight: 2.5, // light effort
    metModerate: 4.0, // general
    metVigorous: 6.0, // powerlifting/bodybuilding
    img: "https://placehold.co/128x128/000/FFF?text=LIFT"
  },
  {
    name: "Rowing Machine",
    metLight: 3.0, // <100 watts
    metModerate: 5.0, // general/moderate
    metVigorous: 7.5, // vigorous
    img: "https://placehold.co/128x128/000/FFF?text=ROW"
  },
  {
    name: "Stair Climbing",
    metLight: 4.0, // slow pace
    metModerate: 6.0, // general
    metVigorous: 8.0, // fast pace
    img: "https://placehold.co/128x128/000/FFF?text=STAIRS"
  },
  {
    name: "Plank (isometric)",
    metLight: 2.8, // Inherently light/isometric, no distinct moderate/vigorous METs
    metModerate: null,
    metVigorous: null,
    img: "https://placehold.co/128x128/000/FFF?text=PLANK"
  },
];
