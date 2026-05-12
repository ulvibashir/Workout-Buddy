export interface Exercise {
  exercise: string;
  sets?: number;
  reps?: string | number;
  duration?: string | number;
  rest?: number;
  distance?: string;
  speed?: string;
  incline?: string;
  notes?: string;
  perSide?: boolean;
  targetReps?: number;
}

export interface WorkoutDay {
  id: string;
  name: string;
  color: string;
  duration: string;
  intensity: "Low" | "Moderate" | "High";
  warmup?: Exercise[];
  activation?: Exercise[];
  exercises: Exercise[];
  cooldown?: Exercise[];
  structure?: { phase: string; duration?: string; sets?: number; distance?: string; stroke?: string; rest?: string; notes?: string; effort?: string; pace?: string; hr?: string }[];
  postureNote?: string;
}

export const MORNING_MOBILITY: Exercise[] = [
  { exercise: "Cat-Cow", sets: 2, reps: 15, notes: "Slow and controlled. Breathe with movement." },
  { exercise: "Hip Flexor Stretch (Kneeling)", sets: 1, duration: 60, perSide: true, notes: "KEY exercise for lordosis. Squeeze glute of back leg." },
  { exercise: "Glute Bridge", sets: 3, reps: 20, notes: "Hold 2 sec at top. Directly fixes pelvic tilt." },
  { exercise: "Dead Bug", sets: 3, reps: 10, perSide: true, notes: "Lower back FLAT on floor. Non-negotiable for lordosis." },
  { exercise: "Thoracic Rotation", sets: 2, reps: 15, perSide: true, notes: "Undoes desk hunching." },
  { exercise: "Hamstring Stretch", sets: 1, duration: 60, perSide: true, notes: "Tight hamstrings worsen lordosis." },
  { exercise: "World's Greatest Stretch", sets: 1, reps: 5, perSide: true, notes: "Most complete stretch for runners and desk workers." },
];

export const WORKOUTS: Record<string, WorkoutDay> = {
  monday: {
    id: "monday",
    name: "Upper Body",
    color: "#fd7e14",
    duration: "60-75 min",
    intensity: "High",
    warmup: [
      { exercise: "Arm Circles", duration: 30, notes: "Forward + backward" },
      { exercise: "Band Pull-Aparts", sets: 2, reps: 15, notes: "Shoulder health" },
      { exercise: "Slow Push Ups", sets: 1, reps: 10, notes: "Chest activation" },
      { exercise: "Glute Bridge Activation", sets: 1, reps: 20, notes: "Non-negotiable for lordosis" },
    ],
    exercises: [
      { exercise: "Pull Ups", sets: 5, reps: "Max (currently 8)", rest: 120, notes: "Full hang. Chin over bar. 3-sec negative. PRIORITY exercise.", targetReps: 8 },
      { exercise: "Bench Press / DB Press", sets: 4, reps: "8-10", rest: 90, notes: "Control descent. Elbows at 45 degrees." },
      { exercise: "Bent Over Row", sets: 4, reps: "10-12", rest: 90, notes: "Pull to hip not chest. Squeeze shoulder blade at top." },
      { exercise: "Overhead Press", sets: 3, reps: "10-12", rest: 90, notes: "Core tight. No arching back — worsens lordosis." },
      { exercise: "Lateral Raise", sets: 3, reps: 15, rest: 60, notes: "Lead with elbows. Shoulder health." },
      { exercise: "Face Pulls", sets: 3, reps: "15-20", rest: 60, notes: "ESSENTIAL for posture. External rotation at end." },
      { exercise: "Tricep Pushdown", sets: 3, reps: "12-15", rest: 60, notes: "Elbows close to body." },
      { exercise: "Bicep Curl", sets: 3, reps: 12, rest: 60, notes: "No swinging. Slow negative 2-3 sec." },
      { exercise: "Dead Bug", sets: 3, reps: "10 each side", rest: 60, notes: "ESSENTIAL for lordosis. Lower back flat." },
      { exercise: "Plank", sets: 3, duration: "45-60 sec", rest: 45, notes: "Straight line head to heel." },
    ],
    cooldown: [
      { exercise: "Chest Doorway Stretch", duration: 60 },
      { exercise: "Lat Stretch", duration: 60, perSide: true },
      { exercise: "Hip Flexor Stretch", duration: 60, perSide: true, notes: "NON-NEGOTIABLE every session" },
      { exercise: "Child's Pose", duration: 60 },
    ],
  },
  tuesday: {
    id: "tuesday",
    name: "Run 8-10km (Zone 2)",
    color: "#0077b6",
    duration: "60-75 min",
    intensity: "Moderate",
    exercises: [
      { exercise: "Warm Up Walk", duration: "5-10 min", notes: "HR < 120 BPM" },
      { exercise: "Zone 2 Run (Main)", duration: "40-55 min", notes: "9:00-10:30/km · HR 135-145 BPM" },
      { exercise: "Pull Ups (mid-run)", sets: 3, reps: "Max", notes: "Find a bar on route" },
      { exercise: "Cooldown Jog + Walk", duration: "5-10 min", notes: "HR 115-125 BPM" },
      { exercise: "Post-run Stretching", duration: "10 min", notes: "IT band, hip flexors, quads, calves" },
    ],
  },
  wednesday: {
    id: "wednesday",
    name: "Lower Body (Glutes Priority)",
    color: "#6f42c1",
    duration: "60-75 min",
    intensity: "High",
    postureNote: "LORDOSIS FIX SESSION — Most important gym day for posture",
    activation: [
      { exercise: "Glute Bridge (slow)", sets: 3, reps: 20, notes: "Wake up glutes BEFORE any heavy lifting" },
      { exercise: "Clamshells with Band", sets: 3, reps: 15, perSide: true, notes: "Glute medius — fixes IT band + pelvic tilt" },
      { exercise: "Fire Hydrants", sets: 2, reps: 15, perSide: true },
      { exercise: "Monster Walks (band)", sets: 2, reps: "10 steps each way" },
    ],
    exercises: [
      { exercise: "Pull Ups", sets: 5, reps: "Max (currently 8)", rest: 120, notes: "Every training day. No exceptions.", targetReps: 8 },
      { exercise: "Barbell Back Squat / Goblet Squat", sets: 4, reps: "8-10", rest: 120, notes: "Chest up. Knees track toes. Go to parallel or below." },
      { exercise: "Romanian Deadlift (RDL)", sets: 4, reps: "10-12", rest: 90, notes: "BEST for glutes + hamstrings. Hinge at hips, feel stretch." },
      { exercise: "Bulgarian Split Squat", sets: 3, reps: "10 each leg", rest: 90, notes: "Back foot elevated. Most glute activation per rep." },
      { exercise: "Hip Thrust", sets: 4, reps: "15-20", rest: 60, notes: "KING of glute exercises. Squeeze 2 sec at top. Fixes pelvic tilt." },
      { exercise: "Leg Press (feet high)", sets: 3, reps: 15, rest: 90, notes: "High foot placement = more glutes." },
      { exercise: "Calf Raises", sets: 4, reps: 20, rest: 60, notes: "Full range — all the way up AND down. Running essential." },
      { exercise: "Nordic Curl / Leg Curl", sets: 3, reps: "10-12", rest: 60, notes: "Hamstring injury prevention." },
      { exercise: "Ab Wheel / Hanging Leg Raise", sets: 3, reps: "10-15", rest: 60, notes: "Core + hip flexor strength." },
    ],
    cooldown: [
      { exercise: "Kneeling Hip Flexor Stretch", duration: 90, perSide: true, notes: "MOST IMPORTANT — fixes lordosis. Every day." },
      { exercise: "Pigeon Pose", duration: 90, perSide: true, notes: "Deep glute stretch after heavy hip work." },
      { exercise: "Hamstring Stretch", duration: 60, perSide: true },
      { exercise: "Figure-4 Glute Stretch", duration: 60, perSide: true },
    ],
  },
  thursday: {
    id: "thursday",
    name: "Swim (Active Recovery)",
    color: "#20c997",
    duration: "40-50 min",
    intensity: "Low",
    exercises: [
      { exercise: "Warm Up Freestyle", distance: "200m", notes: "Very easy effort" },
      { exercise: "Technique Set (4×50m)", sets: 4, distance: "50m", notes: "Focus: breathing, arm entry, kick, rotation. 20 sec rest" },
      { exercise: "Endurance Set (4×100m)", sets: 4, distance: "100m", notes: "Moderate effort · HR 130-145 · 20 sec rest" },
      { exercise: "Pull Ups", sets: 3, reps: "Max", notes: "Pool bars or nearby park" },
      { exercise: "Backstroke Recovery", distance: "200m", notes: "Opens chest — great posture correction" },
      { exercise: "Cooldown Easy", distance: "100m", notes: "Any stroke, easy" },
    ],
  },
  friday: {
    id: "friday",
    name: "Full Body + Pull Ups Power",
    color: "#e94560",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { exercise: "Pull Ups (PRIORITY)", sets: 6, reps: "Max", rest: 90, notes: "MOST pull up volume of the week. Mix grips each set. Track total.", targetReps: 8 },
      { exercise: "Deadlift (Conventional)", sets: 4, reps: "6-8", rest: 180, notes: "King of compounds. Bar close to body. Big breath, brace core before pull." },
      { exercise: "Push Up Variations (explosive)", sets: 4, reps: "15-20", rest: 90, notes: "Regular + wide + diamond. Add clap push ups when strong enough." },
      { exercise: "Dumbbell Snatch / KB Swing", sets: 3, reps: "10 each arm", rest: 90, notes: "Explosive hip drive. Great power + cardio." },
      { exercise: "TRX Row / Inverted Row", sets: 3, reps: 15, rest: 60, notes: "Horizontal pull. Feet elevated for difficulty." },
      { exercise: "Farmer's Carry", sets: 3, distance: "40m", rest: 60, notes: "Grip + core + traps. Walk tall. Heavy DBs." },
      { exercise: "Box Jump / Broad Jump", sets: 3, reps: 8, rest: 60, notes: "Explosive power for running. Land softly." },
      { exercise: "Ab Circuit (Plank+Hollow+Dead Bug)", sets: 3, notes: "Plank 30sec + Hollow 30sec + Dead Bug 10 reps. No rest within round." },
      { exercise: "Backward Treadmill Walk", duration: "10-15 min", speed: "2.5-3.5 km/h", incline: "2-3%", notes: "VMO activation. Protects IT band directly." },
    ],
  },
  saturday: {
    id: "saturday",
    name: "Long Run",
    color: "#dc3545",
    duration: "90-120 min",
    intensity: "Moderate",
    exercises: [
      { exercise: "Warm Up Walk", duration: "5-10 min" },
      { exercise: "Zone 2 Run/Walk (8+2)", duration: "60-90 min", notes: "8 min run + 2 min walk. Strict. HR 135-148." },
      { exercise: "Gel Station", notes: "Every 7km. Walk 90 sec to absorb." },
      { exercise: "Progressive Finish", duration: "Last 2-3km", notes: "Pace 8:00-9:00/km. Finish strong." },
      { exercise: "Cooldown Walk", duration: "5-10 min" },
      { exercise: "Post-run Stretching", duration: "15 min", notes: "IT band, hip flexors, quads, calves, hamstrings." },
    ],
  },
  sunday: {
    id: "sunday",
    name: "Full Rest & Recovery",
    color: "#343a40",
    duration: "30-40 min",
    intensity: "Low",
    exercises: [
      { exercise: "IT Band (outer thigh)", duration: "2 min each leg", notes: "STOP on tight spots 20-30 sec. Main injury risk." },
      { exercise: "Quads", duration: "90 sec each leg", notes: "Tight quads worsen pelvic tilt." },
      { exercise: "Glutes (with ball)", duration: "90 sec each side", notes: "Tennis/massage ball. Cross ankle over knee." },
      { exercise: "Calves", duration: "90 sec each leg", notes: "Ankle to behind knee. Rotate foot in/out." },
      { exercise: "Thoracic Spine", duration: "2 min", notes: "Roller horizontal across upper back. Undoes desk hunching." },
      { exercise: "Hip Flexors (lacrosse ball)", duration: "90 sec each side", notes: "Most important for lordosis." },
      { exercise: "Lats", duration: "60 sec each side", notes: "Side lying, roller under armpit area." },
    ],
  },
};

export const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};
