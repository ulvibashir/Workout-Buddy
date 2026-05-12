"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import RestTimer from "./RestTimer";
import type { Exercise } from "@/lib/data/workouts";

interface SetLog {
  done: boolean;
  weight: string;
  reps: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  accentColor?: string;
  showTimer?: boolean;
}

export default function ExerciseCard({ exercise, accentColor = "#e94560", showTimer = true }: ExerciseCardProps) {
  const numSets = exercise.sets || 1;
  const [sets, setSets] = useState<SetLog[]>(
    Array.from({ length: numSets }, () => ({ done: false, weight: "", reps: "" }))
  );
  const [expanded, setExpanded] = useState(false);
  const [showTimerFor, setShowTimerFor] = useState<number | null>(null);

  const toggleSet = (i: number) => {
    const next = [...sets];
    next[i] = { ...next[i], done: !next[i].done };
    setSets(next);
    if (!next[i].done && showTimer && exercise.rest) {
      setShowTimerFor(i);
    }
  };

  const updateSet = (i: number, field: "weight" | "reps", val: string) => {
    const next = [...sets];
    next[i] = { ...next[i], [field]: val };
    setSets(next);
  };

  const completedSets = sets.filter((s) => s.done).length;
  const allDone = completedSets === numSets;

  return (
    <div
      style={{
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        borderLeft: `3px solid ${allDone ? "#0f9b58" : accentColor}`,
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{exercise.exercise}</span>
            {allDone && <Check size={14} color="#0f9b58" />}
          </div>
          <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
            {exercise.sets && <span>{exercise.sets} sets</span>}
            {exercise.reps && <span> × {exercise.reps}</span>}
            {exercise.duration && <span> · {typeof exercise.duration === "number" ? `${exercise.duration}s` : exercise.duration}</span>}
            {exercise.distance && <span> · {exercise.distance}</span>}
            {exercise.rest && <span> · {exercise.rest}s rest</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: allDone ? "#0f9b58" : "#9ca3af" }}>{completedSets}/{numSets}</span>
          {expanded ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
        </div>
      </div>

      {exercise.notes && (
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontStyle: "italic" }}>{exercise.notes}</div>
      )}

      {expanded && (
        <div style={{ marginTop: 10 }}>
          {sets.map((set, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => toggleSet(i)}
                style={{
                  width: 28, height: 28, borderRadius: "50%", border: `2px solid ${set.done ? "#0f9b58" : accentColor}`,
                  backgroundColor: set.done ? "#0f9b58" : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                {set.done && <Check size={12} color="#fff" />}
              </button>
              <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 40 }}>Set {i + 1}</span>
              <input
                type="number"
                placeholder="kg"
                value={set.weight}
                onChange={(e) => updateSet(i, "weight", e.target.value)}
                style={{
                  width: 52, padding: "4px 6px", background: "#242442", border: "1px solid #2d2d4e",
                  borderRadius: 6, color: "#fff", fontSize: 12, textAlign: "center",
                }}
              />
              <input
                type="number"
                placeholder="reps"
                value={set.reps}
                onChange={(e) => updateSet(i, "reps", e.target.value)}
                style={{
                  width: 52, padding: "4px 6px", background: "#242442", border: "1px solid #2d2d4e",
                  borderRadius: 6, color: "#fff", fontSize: 12, textAlign: "center",
                }}
              />
              {set.done && showTimer && exercise.rest && showTimerFor === i && (
                <RestTimer defaultSeconds={exercise.rest} onComplete={() => setShowTimerFor(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
