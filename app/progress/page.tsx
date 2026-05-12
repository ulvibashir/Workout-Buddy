"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Plus, X } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import MetricCard from "@/components/progress/MetricCard";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAppData } from "@/components/shared/AppProvider";
import { getTodayKey } from "@/lib/utils";

interface MetricEntry {
  id: string;  // date YYYY-MM-DD
  weight: string;
  rhr: string;
  hrv: string;
  vo2max: string;
}

export default function ProgressPage() {
  const { profile } = useProfile();
  const { sixMonthGoals } = useAppData();
  const { items: entries, upsert } = useFirestoreCollection<MetricEntry>("bodyMetrics");
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({ weight: "", rhr: "", hrv: "", vo2max: "" });
  const todayKey = getTodayKey();

  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];

  const saveEntry = () => {
    upsert({ id: todayKey, ...form });
    setShowLog(false);
    setForm({ weight: "", rhr: "", hrv: "", vo2max: "" });
  };

  const current = {
    weight: latest ? parseFloat(latest.weight) || profile.baselineMetrics.weight : profile.baselineMetrics.weight,
    rhr: latest ? parseFloat(latest.rhr) || profile.baselineMetrics.rhr : profile.baselineMetrics.rhr,
    hrv: latest ? parseFloat(latest.hrv) || profile.baselineMetrics.hrv : profile.baselineMetrics.hrv,
    vo2max: latest ? parseFloat(latest.vo2max) || profile.baselineMetrics.vo2max : profile.baselineMetrics.vo2max,
  };

  const prevVals = prev ? { weight: parseFloat(prev.weight), rhr: parseFloat(prev.rhr), hrv: parseFloat(prev.hrv) } : undefined;

  const weightData = sorted.map((e) => ({ date: e.id.slice(5), weight: parseFloat(e.weight) || null })).filter((d) => d.weight);
  const rhrData = sorted.map((e) => ({ date: e.id.slice(5), rhr: parseFloat(e.rhr) || null })).filter((d) => d.rhr);
  const hrvData = sorted.map((e) => ({ date: e.id.slice(5), hrv: parseFloat(e.hrv) || null })).filter((d) => d.hrv);

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Progress</h1>
          <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>6-month hybrid journey</p>
        </div>
        <button onClick={() => setShowLog(true)} style={{ backgroundColor: "#e94560", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Log
        </button>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Marathon Milestone */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12, borderTop: "3px solid #fd7e14" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Trophy size={20} color="#fd7e14" />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Baku Marathon 2026</span>
            <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>May 3, 2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { label: "Distance", value: `${profile.achievements.bakuMarathon2026.distance}km` },
              { label: "Official Time", value: profile.achievements.bakuMarathon2026.officialTime },
              { label: "Avg Pace", value: `${profile.achievements.bakuMarathon2026.avgPace}/km` },
              { label: "Avg HR", value: `${profile.achievements.bakuMarathon2026.avgHR} bpm` },
              { label: "Elevation", value: `${profile.achievements.bakuMarathon2026.elevation}m` },
              { label: "Calories", value: profile.achievements.bakuMarathon2026.calories.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center", padding: "8px 4px", backgroundColor: "#242442", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#fd7e14", marginTop: 8, fontStyle: "italic" }}>Sprint finish km 40-42 at 7:41/km pace. First ever marathon.</p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <MetricCard label="Weight" value={current.weight} unit="kg" prev={prevVals?.weight} color="#fd7e14" />
          <MetricCard label="Resting HR" value={current.rhr} unit="bpm" prev={prevVals?.rhr} color="#e94560" lowerIsBetter />
          <MetricCard label="HRV" value={current.hrv} unit="ms" prev={prevVals?.hrv} color="#0f9b58" />
          <MetricCard label="VO2 Max" value={current.vo2max} unit="ml/kg/min" color="#0077b6" />
        </div>

        {/* Charts */}
        {weightData.length > 1 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Weight (kg)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#fd7e14" strokeWidth={2} dot={{ fill: "#fd7e14", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {rhrData.length > 1 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Resting HR — lower is better</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={rhrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rhr" stroke="#e94560" strokeWidth={2} dot={{ fill: "#e94560", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {hrvData.length > 1 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>HRV (ms)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={hrvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="hrv" stroke="#0f9b58" strokeWidth={2} dot={{ fill: "#0f9b58", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 6-Month Goals */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={16} color="#e94560" />
            <span style={{ fontWeight: 700, fontSize: 15 }}>6-Month Goals</span>
          </div>
          {sixMonthGoals.map((goal) => (
            <div key={goal.metric} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{goal.metric}</span>
                <span style={{ color: "#9ca3af" }}>
                  {(goal as any).displayStart || goal.start} → {(goal as any).displayMonth6 || goal.month6} {goal.unit}
                </span>
              </div>
              <div style={{ height: 6, backgroundColor: "#242442", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "2%", backgroundColor: "#e94560", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      {showLog && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ backgroundColor: "#1a1a2e", width: "100%", borderRadius: "16px 16px 0 0", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Log Body Metrics</h3>
              <button onClick={() => setShowLog(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#9ca3af" /></button>
            </div>
            {[
              { field: "weight" as const, label: "Weight (kg)", placeholder: "68" },
              { field: "rhr" as const, label: "Resting HR (bpm)", placeholder: "58" },
              { field: "hrv" as const, label: "HRV (ms)", placeholder: "65" },
              { field: "vo2max" as const, label: "VO2 Max (ml/kg/min)", placeholder: "41.1" },
            ].map(({ field, label, placeholder }) => (
              <div key={field} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>{label}</label>
                <input type="number" placeholder={placeholder} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", background: "#242442", border: "1px solid #2d2d4e", borderRadius: 8, color: "#fff", fontSize: 16 }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => setShowLog(false)} style={{ flex: 1, padding: 12, background: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveEntry} style={{ flex: 2, padding: 12, background: "#e94560", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
