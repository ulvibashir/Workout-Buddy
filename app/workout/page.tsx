"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import ExerciseCard from "@/components/workout/ExerciseCard";
import { useAppData } from "@/components/shared/AppProvider";
import { getDayOfWeek } from "@/lib/utils";
import { DAY_ORDER, DAY_LABELS } from "@/lib/data/workouts";

export default function WorkoutPage() {
  const { workoutDays, morningMobility } = useAppData();
  const todayDayKey = getDayOfWeek();
  const [selectedDay, setSelectedDay] = useState(todayDayKey);
  const [mobilityOpen, setMobilityOpen] = useState(false);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [cooldownOpen, setCooldownOpen] = useState(false);

  const workout = workoutDays[selectedDay];

  if (!workout) {
    return (
      <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading workout data...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Workout Plan</h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>7-day hybrid program</p>
      </div>

      {/* Day selector */}
      <div style={{ padding: "12px 16px", display: "flex", gap: 6, overflowX: "auto" }}>
        {DAY_ORDER.map((d) => {
          const w = workoutDays[d];
          const isSelected = d === selectedDay;
          const isToday = d === todayDayKey;
          return (
            <button key={d} onClick={() => setSelectedDay(d)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: isToday ? `2px solid ${w.color}` : "2px solid transparent", backgroundColor: isSelected ? w.color : "#1a1a2e", color: isSelected ? "#fff" : isToday ? w.color : "#9ca3af", cursor: "pointer", fontSize: 12, fontWeight: isSelected ? 700 : 400 }}>
              {DAY_LABELS[d].slice(0, 3)}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Workout header */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12, borderLeft: `4px solid ${workout.color}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{workout.name}</h2>
          <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#9ca3af" }}>
            <span>{workout.duration}</span>
            <span>·</span>
            <span style={{ color: workout.intensity === "High" ? "#e94560" : workout.intensity === "Moderate" ? "#fd7e14" : "#0f9b58" }}>
              {workout.intensity}
            </span>
          </div>
          {workout.postureNote && (
            <div style={{ marginTop: 8, padding: "6px 10px", backgroundColor: "#6f42c122", borderRadius: 8, fontSize: 11, color: "#c084fc" }}>
              {workout.postureNote}
            </div>
          )}
        </div>

        {/* Morning Mobility */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, marginBottom: 10 }}>
          <button onClick={() => setMobilityOpen(!mobilityOpen)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#20c997" }}>Morning Mobility (15 min)</span>
            {mobilityOpen ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
          </button>
          {mobilityOpen && (
            <div style={{ padding: "0 14px 14px" }}>
              {morningMobility.map((ex, i) => <ExerciseCard key={i} exercise={ex} accentColor="#20c997" showTimer={false} />)}
            </div>
          )}
        </div>

        {/* Warmup */}
        {workout.warmup && workout.warmup.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, marginBottom: 10 }}>
            <button onClick={() => setWarmupOpen(!warmupOpen)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fd7e14" }}>Warmup</span>
              {warmupOpen ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
            </button>
            {warmupOpen && (
              <div style={{ padding: "0 14px 14px" }}>
                {workout.warmup.map((ex, i) => <ExerciseCard key={i} exercise={ex} accentColor="#fd7e14" showTimer={false} />)}
              </div>
            )}
          </div>
        )}

        {/* Activation */}
        {workout.activation && workout.activation.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, marginBottom: 10 }}>
            <div style={{ padding: 14, borderBottom: "1px solid #2d2d4e" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#6f42c1" }}>Activation</span>
            </div>
            <div style={{ padding: "10px 14px 14px" }}>
              {workout.activation.map((ex, i) => <ExerciseCard key={i} exercise={ex} accentColor="#6f42c1" showTimer={false} />)}
            </div>
          </div>
        )}

        {/* Main Exercises */}
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 12, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Main Exercises</p>
          {workout.exercises.map((ex, i) => <ExerciseCard key={i} exercise={ex} accentColor={workout.color} />)}
        </div>

        {/* Cooldown */}
        {workout.cooldown && workout.cooldown.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, marginBottom: 16 }}>
            <button onClick={() => setCooldownOpen(!cooldownOpen)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#0077b6" }}>Cooldown & Stretch</span>
              {cooldownOpen ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
            </button>
            {cooldownOpen && (
              <div style={{ padding: "0 14px 14px" }}>
                {workout.cooldown.map((ex, i) => <ExerciseCard key={i} exercise={ex} accentColor="#0077b6" showTimer={false} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
