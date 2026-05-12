"use client";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ATHLETE } from "@/lib/data/athlete";
import { useFirestoreDoc } from "./useFirestoreData";

export interface UserProfile {
  name: string;
  weight: number;
  age: number | null;
  job: string;
  workHours: string;
  postureIssues: string[];
  sittingHours: number;
  goals: {
    primary: string;
    inspiration: string;
    secondaryGoals: string[];
  };
  baselineMetrics: {
    weight: number;
    rhr: number;
    hrv: number;
    vo2max: number;
    pullUpMax: number;
    tenKmPace: string;
  };
  achievements: {
    bakuMarathon2026: {
      date: string;
      distance: number;
      officialTime: string;
      avgPace: string;
      avgHR: number;
      avgCadence: number;
      elevation: number;
      calories: number;
      note: string;
    };
  };
}

const DEFAULT_PROFILE: UserProfile = {
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
};

export function useProfile() {
  const { data: profile, loading, save } = useFirestoreDoc<UserProfile>(
    "profile", "main", DEFAULT_PROFILE
  );

  // Seed Firestore with default profile on first ever load
  useEffect(() => {
    const profileRef = doc(db, "users/ulvi/profile/main");
    getDoc(profileRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(profileRef, DEFAULT_PROFILE);
      }
    });
  }, []);

  return { profile, loading, save };
}
