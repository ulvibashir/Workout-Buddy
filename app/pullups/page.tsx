"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Minus, Target, RefreshCw } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { PULLUP_PROGRAM } from "@/lib/data/athlete";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";
import { getTodayKey } from "@/lib/utils";

interface PullUpSession {
  id: string;      // date string YYYY-MM-DD
  sets: number[];
  maxReps: number;
  totalReps: number;
}

export default function PullUpsPage() {
  const { items: sessions, upsert } = useFirestoreCollection<PullUpSession>("pullUpLogs");
  const todayKey = getTodayKey();

  const todaySession = sessions.find((s) => s.id === todayKey);
  const todaySets = todaySession?.sets ?? [];
  const [currentReps, setCurrentReps] = useState(PULLUP_PROGRAM.currentTraining.reps);

  const addSet = (reps: number) => {
    const newSets = [...todaySets, reps];
    upsert({
      id: todayKey,
      sets: newSets,
      maxReps: Math.max(...newSets),
      totalReps: newSets.reduce((a, b) => a + b, 0),
    });
  };

  const removeLastSet = () => {
    const newSets = todaySets.slice(0, -1);
    upsert({
      id: todayKey,
      sets: newSets,
      maxReps: newSets.length ? Math.max(...newSets) : 0,
      totalReps: newSets.reduce((a, b) => a + b, 0),
    });
  };

  const allTimeMax = sessions.length
    ? Math.max(...sessions.map((s) => s.maxReps), PULLUP_PROGRAM.currentMax)
    : PULLUP_PROGRAM.currentMax;

  const chartData = [...sessions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(-14)
    .map((s) => ({ date: s.id.slice(5), total: s.totalReps, max: s.maxReps }));

  const totalSets = todaySets.length;
  const totalReps = todaySets.reduce((a, b) => a + b, 0);
  const targetTotal = PULLUP_PROGRAM.currentTraining.sets * PULLUP_PROGRAM.currentTraining.reps;

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Pull Up Tracker</h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Goal: 10 → 20 reps</p>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, textAlign: "center", borderTop: "3px solid #e94560" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#e94560" }}>{allTimeMax}</div>
            <div style={{ color: "#9ca3af", fontSize: 12 }}>All-Time Max Reps</div>
          </div>
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, textAlign: "center", borderTop: "3px solid #0077b6" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#0077b6" }}>
              {PULLUP_PROGRAM.currentTraining.sets}×{PULLUP_PROGRAM.currentTraining.reps}
            </div>
            <div style={{ color: "#9ca3af", fontSize: 12 }}>Training Protocol</div>
          </div>
        </div>

        {/* Today's Log */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Today's Sets</span>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>{totalReps}/{targetTotal} reps</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {todaySets.map((reps, i) => (
              <div key={i} style={{ backgroundColor: "#242442", borderRadius: 8, padding: "6px 14px", fontSize: 16, fontWeight: 700, color: "#e94560", border: "1px solid #e9456033" }}>
                {reps}
              </div>
            ))}
            {todaySets.length === 0 && <span style={{ color: "#9ca3af", fontSize: 13 }}>No sets logged yet</span>}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 14 }}>
            <button onClick={() => setCurrentReps((r) => Math.max(1, r - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #2d2d4e", background: "#242442", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Minus size={18} />
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{currentReps}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>reps</div>
            </div>
            <button onClick={() => setCurrentReps((r) => r + 1)} style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "#e94560", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => addSet(currentReps)} style={{ flex: 1, padding: 12, backgroundColor: "#e94560", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Log Set {totalSets + 1}
            </button>
            {todaySets.length > 0 && (
              <button onClick={removeLastSet} style={{ width: 46, padding: 12, backgroundColor: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer" }}>
                <Minus size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grip Rotation */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <RefreshCw size={16} color="#fd7e14" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Grip Rotation</span>
          </div>
          {PULLUP_PROGRAM.grips.map((g) => (
            <div key={g.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #2d2d4e" }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</span>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{g.grip} · {g.primaryMuscle}</div>
              </div>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, backgroundColor: g.difficulty === "Hard" ? "#e9456022" : g.difficulty === "Easier" ? "#0f9b5822" : "#0077b622", color: g.difficulty === "Hard" ? "#e94560" : g.difficulty === "Easier" ? "#0f9b58" : "#0077b6" }}>
                {g.difficulty}
              </span>
            </div>
          ))}
        </div>

        {/* Volume Chart */}
        {chartData.length > 1 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Volume (last 14 days)</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8 }} />
                <Bar dataKey="total" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Progression Plan */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Target size={16} color="#0f9b58" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>6-Month Progression</span>
          </div>
          {PULLUP_PROGRAM.weeklyProgression.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #2d2d4e" }}>
              <div style={{ width: 56, flexShrink: 0, fontSize: 11, color: "#fd7e14", fontWeight: 600 }}>
                {(p as any).weeks ? `Wk ${(p as any).weeks}` : `Mo ${(p as any).month}`}
              </div>
              <div>
                <span style={{ fontSize: 13 }}>{p.sets} × {p.reps} = {p.total} reps</span>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{p.notes}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
