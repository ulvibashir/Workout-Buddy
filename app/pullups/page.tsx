"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";

interface PullUpSession {
  id: string;
  sets: number[];
  maxReps: number;
  totalReps: number;
}

export default function PullUpsPage() {
  const { items: sessions } = useFirestoreCollection<PullUpSession>("pullUpLogs");

  const allTimeMax = sessions.length ? Math.max(...sessions.map((s) => s.maxReps)) : 0;
  const totalRepsAllTime = sessions.reduce((a, s) => a + s.totalReps, 0);

  const chartData = [...sessions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(-14)
    .map((s) => ({ date: s.id.slice(5), total: s.totalReps, max: s.maxReps }));

  const sortedSessions = [...sessions].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ padding: "20px 24px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Pull Ups</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Session history</p>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "All-Time Max", value: allTimeMax, unit: "reps", color: "#e94560" },
            { label: "Sessions", value: sessions.length, unit: "logged", color: "#0077b6" },
            { label: "Total Reps", value: totalRepsAllTime, unit: "ever", color: "#0f9b58" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ backgroundColor: "var(--surface)", borderRadius: 12, padding: "14px 12px", textAlign: "center", borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{unit}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Volume chart */}
        {chartData.length > 1 && (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Volume — last 14 sessions</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                  labelStyle={{ color: "var(--text-muted)" }}
                />
                <Bar dataKey="total" fill="#e94560" radius={[4, 4, 0, 0]} name="Total reps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Session history */}
        {sortedSessions.length > 0 ? (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>History</p>
            {sortedSessions.map((session, i) => (
              <div key={session.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < sortedSessions.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{session.id}</div>
                  <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                    {session.sets?.map((reps, j) => (
                      <span key={j} style={{ fontSize: 11, backgroundColor: "var(--surface-light)", borderRadius: 6, padding: "2px 8px", color: "#e94560", fontWeight: 700 }}>
                        {reps}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, color: "#e94560", fontWeight: 800 }}>{session.maxReps}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>max</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{session.totalReps} total</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 32, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No sessions logged yet.</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Log pull-up sessions from the iOS app.</p>
          </div>
        )}
      </div>
    </div>
  );
}
