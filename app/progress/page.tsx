"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target } from "lucide-react";
import MetricCard from "@/components/progress/MetricCard";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAppData } from "@/components/shared/AppProvider";

interface MetricEntry {
  id: string;
  weight: string;
  rhr: string;
  hrv: string;
  vo2max: string;
}

export default function ProgressPage() {
  const { profile } = useProfile();
  const { sixMonthGoals } = useAppData();
  const { items: entries } = useFirestoreCollection<MetricEntry>("bodyMetrics");

  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];

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

  const getProgress = (goal: (typeof sixMonthGoals)[number]) => {
    const currentVal = goal.metric === "Body Weight" ? current.weight
      : goal.metric === "RHR" ? current.rhr
      : goal.metric === "HRV" ? current.hrv
      : goal.metric === "VO2 Max" ? current.vo2max
      : null;
    if (currentVal === null) return 0;
    const range = Math.abs((goal as any).month6 - goal.start);
    if (!range) return 0;
    const done = goal.lowerIsBetter ? goal.start - currentVal : currentVal - goal.start;
    return Math.min(1, Math.max(0, done / range));
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ padding: "24px 24px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Progress</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>6-month hybrid journey</p>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Marathon Milestone */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 16, marginBottom: 12, borderTop: "3px solid #fd7e14" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Trophy size={20} color="#fd7e14" />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Baku Marathon 2026</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>May 3, 2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { label: "Distance", value: `${profile.achievements.bakuMarathon2026.distance}km` },
              { label: "Official Time", value: profile.achievements.bakuMarathon2026.officialTime },
              { label: "Avg Pace", value: profile.achievements.bakuMarathon2026.avgPace },
              { label: "Avg HR", value: `${profile.achievements.bakuMarathon2026.avgHR} bpm` },
              { label: "Elevation", value: `${profile.achievements.bakuMarathon2026.elevation}m` },
              { label: "Calories", value: profile.achievements.bakuMarathon2026.calories.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center", padding: "8px 4px", backgroundColor: "var(--surface-light)", borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{label}</div>
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
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Weight (kg)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#fd7e14" strokeWidth={2} dot={{ fill: "#fd7e14", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {rhrData.length > 1 && (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Resting HR — lower is better</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={rhrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rhr" stroke="#e94560" strokeWidth={2} dot={{ fill: "#e94560", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {hrvData.length > 1 && (
          <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>HRV (ms)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={hrvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="hrv" stroke="#0f9b58" strokeWidth={2} dot={{ fill: "#0f9b58", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 6-Month Goals */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={16} color="#e94560" />
            <span style={{ fontWeight: 700, fontSize: 15 }}>6-Month Goals · Nov 2026</span>
          </div>
          {sixMonthGoals.map((goal) => {
            const prog = getProgress(goal);
            return (
              <div key={goal.metric} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{goal.metric}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {(goal as any).displayStart || goal.start} → {(goal as any).displayMonth6 || (goal as any).month6} {goal.unit}
                  </span>
                </div>
                <div style={{ height: 6, backgroundColor: "var(--surface-light)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.max(2, prog * 100)}%`, backgroundColor: "#e94560", borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
                {prog > 0 && (
                  <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{Math.round(prog * 100)}% to goal</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
