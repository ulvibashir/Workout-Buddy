export const ATHLETE = {
  name: "Ulvi",
  weight: 68,
  job: "iOS Developer at Kapital Bank, Baku, Azerbaijan",
  workHours: "9:00-18:00",
  postureIssues: ["Pelvic tilt", "Lumbar lordosis"],
  sittingHours: 8,
  goals: {
    primary: "Hybrid Athlete (equal strength + endurance)",
    inspiration: "Arda Saatci (Red Bull Cyborg)",
    secondaryGoals: [
      "Fix pelvic tilt and lumbar lordosis",
      "Improve running pace from 9:06/km to 7:00/km",
      "Pull ups from 10 max to 20+ reps",
      "RHR from 58-63 to 50-54 BPM",
      "HRV from 55-65ms to 70-80ms",
    ],
  },
  achievements: {
    bakuMarathon2026: {
      date: "May 3, 2026",
      distance: 43.08,
      officialTime: "6:39:03",
      avgPace: "9:06/km",
      avgHR: 157,
      avgCadence: 160,
      elevation: 333,
      calories: 2838,
      note: "First ever marathon. Sprint finish at km 40-42 with 7:41/km pace.",
    },
  },
  baselineMetrics: {
    weight: 68,
    rhr: 58,
    hrv: 65,
    vo2max: 41.1,
    pullUpMax: 10,
    tenKmPace: "9:06",
  },
};

export const SIX_MONTH_GOALS = [
  { metric: "Body Weight", start: 68, month3: 71, month6: 73, unit: "kg", lowerIsBetter: false },
  { metric: "Pull Ups (max set)", start: 10, month3: 13, month6: 20, unit: "reps", lowerIsBetter: false },
  { metric: "10km Pace", start: 9.1, month3: 8.0, month6: 7.0, unit: "min/km", lowerIsBetter: true, displayStart: "9:06", displayMonth3: "8:00", displayMonth6: "7:00" },
  { metric: "RHR", start: 60, month3: 56, month6: 52, unit: "BPM", lowerIsBetter: true },
  { metric: "HRV", start: 60, month3: 68, month6: 75, unit: "ms", lowerIsBetter: false },
  { metric: "VO2 Max", start: 41.1, month3: 44, month6: 48, unit: "ml/kg/min", lowerIsBetter: false },
  { metric: "Long Run Distance", start: 12, month3: 18, month6: 25, unit: "km", lowerIsBetter: false },
  { metric: "Swim Distance", start: 600, month3: 1000, month6: 1500, unit: "m", lowerIsBetter: false },
];

export const QUOTES = [
  "Every day is day one. — Arda Saatci",
  "You ran 43km on May 3rd. Your body knows how to suffer. Now make it stronger.",
  "You vs You. Nobody else.",
  "The pull up bar doesn't care about your excuses.",
  "Zone 2 today. Sub-7 pace tomorrow.",
  "Arda does 1000 pull ups. You do 8. Both started at 0.",
  "Desk job by day. Hybrid athlete by night.",
  "Your IT band recovered. Your discipline shouldn't need to.",
  "6:39 at your first marathon. What's next?",
  "Strong enough to run. Fast enough to lift. Smart enough to recover.",
];

export const PULLUP_PROGRAM = {
  currentMax: 10,
  currentTraining: { sets: 5, reps: 8 },
  restBetweenSets: 120,
  testEvery: 14,
  weeklyProgression: [
    { weeks: "1-2", sets: 5, reps: 8, rest: 120, total: 40, notes: "Establish baseline. 3-sec negative every rep." },
    { weeks: "3-4", sets: 5, reps: 9, rest: 120, total: 45, notes: "Add wide grip variation." },
    { weeks: "5-6", sets: 5, reps: 10, rest: 120, total: 50, notes: "Mix grips each set." },
    { weeks: "7-8", sets: 6, reps: 10, rest: 90, total: 60, notes: "Add 5kg vest if getting easy." },
    { month: 3, sets: 6, reps: 12, rest: 90, total: 72, notes: "Milestone: 10 clean reps foundation." },
    { month: 4, sets: 5, reps: 15, rest: 90, total: 75, notes: "Add archer pull ups." },
    { month: 6, sets: 5, reps: 20, rest: 90, total: 100, notes: "Target: 20 reps = serious hybrid athlete." },
  ],
  grips: [
    { name: "Standard", grip: "Overhand shoulder-width", primaryMuscle: "Lats, upper back", difficulty: "Medium" },
    { name: "Chin Up", grip: "Underhand", primaryMuscle: "Biceps + lats", difficulty: "Easier" },
    { name: "Wide Grip", grip: "Overhand wide", primaryMuscle: "Outer lats, V-taper", difficulty: "Hard" },
    { name: "Neutral", grip: "Palms facing", primaryMuscle: "Lats + biceps", difficulty: "Medium" },
    { name: "Slow Negative", grip: "Any + 5 sec down", primaryMuscle: "Full eccentric", difficulty: "Hard" },
  ],
};
