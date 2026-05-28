"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target, RefreshCw } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { useAppData } from "@/components/shared/AppProvider";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";

interface PullUpSession {
  id: string;
  sets: number[];
  maxReps: number;
  totalReps: number;
}

export default function PullUpsPage() {
  const { pullupProgram } = useAppData();
  const { items: sessions } = useFirestoreCollection<PullUpSession>("pullUpLogs");

  const allTimeMax = sessions.length
    ? Math.max(...sessions.map((s) => s.maxReps), pullupProgram.currentMax)
    : pullupProgram.currentMax;

  const chartData = [...sessions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(-14)
    .map((s) => ({ date: s.id.slice(5), total: s.totalReps, max: s.maxReps }));

  const sortedSessions = [...sessions].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Pull Up Tracker</h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Goal: {pullupProgram.currentMax} → 20 reps</p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, textAlign: "center", borderTop: "3px solid #e94560" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#e94560" }}>{allTimeMax}</div>
            <div style={{ color: "#9ca3af", fontSize: 12 }}>All-Time Max Reps</div>
          </div>
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, textAlign: "center", borderTop: "3px solid #0077b6" }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#0077b6" }}>
              {pullupProgram.currentTraining.sets}×{pullupProgram.currentTraining.reps}
            </div>
            <div style={{ color: "#9ca3af", fontSize: 12 }}>Training Protocol</div>
          </div>
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

        {/* Recent sessions */}
        {sortedSessions.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Recent Sessions</p>
            {sortedSessions.slice(0, 7).map((session) => (
              <div key={session.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #2d2d4e" }}>
                <div>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>{session.id}</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    {session.sets?.map((reps, i) => (
                      <span key={i} style={{ fontSize: 11, backgroundColor: "#242442", borderRadius: 6, padding: "2px 8px", color: "#e94560", fontWeight: 700 }}>
                        {reps}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, color: "#e94560", fontWeight: 700 }}>{session.maxReps} max</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{session.totalReps} total</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grip Rotation */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <RefreshCw size={16} color="#fd7e14" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Grip Rotation</span>
          </div>
          {pullupProgram.grips.map((g) => (
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

        {/* 6-Month Progression Plan */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Target size={16} color="#0f9b58" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>6-Month Progression</span>
          </div>
          {pullupProgram.weeklyProgression.map((p, i) => (
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
