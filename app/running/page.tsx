"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";

interface RunLog {
  id: string;
  date: string;
  distance: number;
  time: string;
  avgHR: number;
  avgPace: string;
  notes: string;
  runType: string;
}

const MARATHON: RunLog = {
  id: "marathon_baku_2026",
  date: "2026-05-03",
  distance: 43.08,
  time: "6:39:03",
  avgHR: 157,
  avgPace: "9:06",
  notes: "First ever marathon! Sprint finish km 40-42. Avg cadence 160. Elevation 333m. 2838 kcal.",
  runType: "Race",
};

export default function RunningPage() {
  const { items: runs } = useFirestoreCollection<RunLog>("runningLogs");

  const allRuns = runs.some((r) => r.id === MARATHON.id) ? runs : [...runs, MARATHON];
  const sortedRuns = [...allRuns].sort((a, b) => b.date.localeCompare(a.date));
  const totalKm = allRuns.reduce((a, r) => a + r.distance, 0);
  const longestRun = Math.max(...allRuns.map((r) => r.distance));

  const monthlyData: Record<string, number> = {};
  allRuns.forEach((r) => {
    const month = r.date.slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + r.distance;
  });
  const monthlyChart = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, km]) => ({ month: month.slice(5), km: Math.round(km * 10) / 10 }));

  const paceChart = [...allRuns]
    .filter((r) => r.avgPace && r.distance > 5)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => {
      const parts = r.avgPace.split(":");
      const mins = parseInt(parts[0]) + (parseInt(parts[1] || "0") / 60);
      return { date: r.date.slice(5), pace: Math.round(mins * 100) / 100 };
    });

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ padding: "24px 24px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Running Log</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Target: 9:06 → 7:00/km</p>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Total km", value: `${Math.round(totalKm * 10) / 10}`, unit: "km", color: "#0077b6" },
            { label: "Longest Run", value: `${longestRun}`, unit: "km", color: "#e94560" },
            { label: "Runs Logged", value: `${allRuns.length}`, unit: "", color: "#0f9b58" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ backgroundColor: "var(--surface)", borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}{unit}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Monthly km chart */}
        {monthlyChart.length > 0 && (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Monthly km</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="km" fill="#0077b6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pace progression chart */}
        {paceChart.length > 1 && (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Pace Progression</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>min/km — lower is faster</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={paceChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="pace" stroke="#e94560" strokeWidth={2} dot={{ fill: "#e94560", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Progression Targets */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Monthly Progression Targets</p>
          {[
            { month: 1, distance: "10-12km", pace: "10:00-10:30/km" },
            { month: 2, distance: "12-15km", pace: "9:30-10:00/km" },
            { month: 3, distance: "15-18km", pace: "9:00-9:30/km" },
            { month: 4, distance: "18-21km", pace: "8:30-9:00/km" },
            { month: 5, distance: "21km+", pace: "8:00-8:30/km" },
            { month: 6, distance: "25km+", pace: "7:30-8:00/km" },
          ].map((p) => (
            <div key={p.month} style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 48, flexShrink: 0, fontSize: 11, color: "#0077b6", fontWeight: 600 }}>Mo {p.month}</div>
              <div style={{ fontSize: 13 }}>{p.distance}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: "auto" }}>{p.pace}</div>
            </div>
          ))}
        </div>

        {/* History */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>History</p>
          {sortedRuns.map((run) => (
            <div key={run.id} style={{ backgroundColor: "var(--surface)", borderRadius: 12, padding: 14, marginBottom: 8, borderLeft: run.runType === "Race" ? "3px solid #fd7e14" : "3px solid #0077b6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{run.distance}km</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{run.date} · {run.runType}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {run.avgPace && <div style={{ fontWeight: 700 }}>{run.avgPace}/km</div>}
                  {run.avgHR > 0 && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{run.avgHR} bpm</div>}
                </div>
              </div>
              {run.time && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Time: {run.time}</div>}
              {run.notes && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>{run.notes}</div>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
