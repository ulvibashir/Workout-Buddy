"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WORKOUTS, MORNING_MOBILITY, DAY_ORDER } from "@/lib/data/workouts";
import { NUTRITION_TARGETS, FOOD_DATABASE, SUPPLEMENTS } from "@/lib/data/nutrition";
import { ATHLETE, PULLUP_PROGRAM, SIX_MONTH_GOALS, QUOTES } from "@/lib/data/athlete";

const UID = "ulvi";
const SEED_FLAG = `users/${UID}/meta/seeded`;

export function useSeeder() {
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(true);

  useEffect(() => {
    async function seed() {
      // Check if already seeded
      const flagSnap = await getDoc(doc(db, SEED_FLAG));
      if (flagSnap.exists()) {
        setSeeded(true);
        setSeeding(false);
        return;
      }

      const batch = writeBatch(db);

      // 1. Profile
      batch.set(doc(db, `users/${UID}/profile/main`), {
        name: ATHLETE.name,
        weight: ATHLETE.weight,
        age: null,
        job: ATHLETE.job,
        workHours: ATHLETE.workHours,
        postureIssues: ATHLETE.postureIssues,
        sittingHours: ATHLETE.sittingHours,
        goals: ATHLETE.goals,
        baselineMetrics: ATHLETE.baselineMetrics,
        achievements: ATHLETE.achievements,
      });

      // 2. Workout days (Mon–Sun + morning mobility)
      for (const day of DAY_ORDER) {
        batch.set(doc(db, `users/${UID}/workoutDays/${day}`), WORKOUTS[day]);
      }
      batch.set(doc(db, `users/${UID}/workoutDays/morningMobility`), {
        exercises: MORNING_MOBILITY,
      });

      // 3. Nutrition config
      batch.set(doc(db, `users/${UID}/nutritionConfig/targets`), NUTRITION_TARGETS);
      batch.set(doc(db, `users/${UID}/nutritionConfig/supplements`), {
        items: SUPPLEMENTS,
      });

      // 4. Food database
      batch.set(doc(db, `users/${UID}/foodDatabase/all`), {
        foods: FOOD_DATABASE,
      });

      // 5. Pull-up program
      batch.set(doc(db, `users/${UID}/pullupProgram/main`), PULLUP_PROGRAM);

      // 6. Goals & quotes
      batch.set(doc(db, `users/${UID}/goals/sixMonth`), { goals: SIX_MONTH_GOALS });
      batch.set(doc(db, `users/${UID}/goals/quotes`), { quotes: QUOTES });

      // Commit in one batch
      await batch.commit();

      // Mark as seeded
      await setDoc(doc(db, SEED_FLAG), { seededAt: new Date().toISOString() });

      setSeeded(true);
      setSeeding(false);
    }

    seed().catch((e) => {
      console.error("[Seeder] failed:", e.message);
      setSeeding(false);
    });
  }, []);

  return { seeded, seeding };
}
