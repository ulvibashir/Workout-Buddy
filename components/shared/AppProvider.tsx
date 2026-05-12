"use client";
import { createContext, useContext } from "react";
import { useSeeder } from "@/lib/hooks/useSeeder";
import { useFirestoreDoc } from "@/lib/hooks/useFirestoreData";
import type { WorkoutDay } from "@/lib/data/workouts";
import type { FoodItem } from "@/lib/data/nutrition";
import { WORKOUTS, MORNING_MOBILITY } from "@/lib/data/workouts";
import { NUTRITION_TARGETS, FOOD_DATABASE, SUPPLEMENTS } from "@/lib/data/nutrition";
import { PULLUP_PROGRAM, SIX_MONTH_GOALS, QUOTES } from "@/lib/data/athlete";

interface AppData {
  seeding: boolean;
  workoutDays: Record<string, WorkoutDay>;
  morningMobility: typeof MORNING_MOBILITY;
  nutritionTargets: typeof NUTRITION_TARGETS;
  supplements: typeof SUPPLEMENTS;
  foodDatabase: FoodItem[];
  pullupProgram: typeof PULLUP_PROGRAM;
  sixMonthGoals: typeof SIX_MONTH_GOALS;
  quotes: string[];
}

const AppContext = createContext<AppData>({
  seeding: true,
  workoutDays: WORKOUTS,
  morningMobility: MORNING_MOBILITY,
  nutritionTargets: NUTRITION_TARGETS,
  supplements: SUPPLEMENTS,
  foodDatabase: FOOD_DATABASE,
  pullupProgram: PULLUP_PROGRAM,
  sixMonthGoals: SIX_MONTH_GOALS,
  quotes: QUOTES,
});

export function useAppData() {
  return useContext(AppContext);
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const { seeding } = useSeeder();

  // Read all program data from Firestore
  const { data: wMon } = useFirestoreDoc<WorkoutDay>("workoutDays", "monday", WORKOUTS.monday);
  const { data: wTue } = useFirestoreDoc<WorkoutDay>("workoutDays", "tuesday", WORKOUTS.tuesday);
  const { data: wWed } = useFirestoreDoc<WorkoutDay>("workoutDays", "wednesday", WORKOUTS.wednesday);
  const { data: wThu } = useFirestoreDoc<WorkoutDay>("workoutDays", "thursday", WORKOUTS.thursday);
  const { data: wFri } = useFirestoreDoc<WorkoutDay>("workoutDays", "friday", WORKOUTS.friday);
  const { data: wSat } = useFirestoreDoc<WorkoutDay>("workoutDays", "saturday", WORKOUTS.saturday);
  const { data: wSun } = useFirestoreDoc<WorkoutDay>("workoutDays", "sunday", WORKOUTS.sunday);
  const { data: mobilityDoc } = useFirestoreDoc<{ exercises: typeof MORNING_MOBILITY }>(
    "workoutDays", "morningMobility", { exercises: MORNING_MOBILITY }
  );
  const { data: nutritionTargets } = useFirestoreDoc<typeof NUTRITION_TARGETS>(
    "nutritionConfig", "targets", NUTRITION_TARGETS
  );
  const { data: supplementsDoc } = useFirestoreDoc<{ items: typeof SUPPLEMENTS }>(
    "nutritionConfig", "supplements", { items: SUPPLEMENTS }
  );
  const { data: foodDoc } = useFirestoreDoc<{ foods: FoodItem[] }>(
    "foodDatabase", "all", { foods: FOOD_DATABASE }
  );
  const { data: pullupProgram } = useFirestoreDoc<typeof PULLUP_PROGRAM>(
    "pullupProgram", "main", PULLUP_PROGRAM
  );
  const { data: goalsDoc } = useFirestoreDoc<{ goals: typeof SIX_MONTH_GOALS }>(
    "goals", "sixMonth", { goals: SIX_MONTH_GOALS }
  );
  const { data: quotesDoc } = useFirestoreDoc<{ quotes: string[] }>(
    "goals", "quotes", { quotes: QUOTES }
  );

  const value: AppData = {
    seeding,
    workoutDays: {
      monday: wMon,
      tuesday: wTue,
      wednesday: wWed,
      thursday: wThu,
      friday: wFri,
      saturday: wSat,
      sunday: wSun,
    },
    morningMobility: mobilityDoc.exercises,
    nutritionTargets,
    supplements: supplementsDoc.items,
    foodDatabase: foodDoc.foods,
    pullupProgram,
    sixMonthGoals: goalsDoc.goals,
    quotes: quotesDoc.quotes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
