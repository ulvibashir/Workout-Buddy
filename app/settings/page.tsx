"use client";
import { useState } from "react";
import { User, Download, ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAppData } from "@/components/shared/AppProvider";

const UID = "ulvi";
const COLLECTIONS = ["profile", "bodyMetrics", "nutritionLogs", "pullUpLogs", "runningLogs", "workoutLogs"];

export default function SettingsPage() {
  const { profile, loading } = useProfile();
  const { nutritionTargets } = useAppData();
  const [exportMsg, setExportMsg] = useState("");

  const exportData = async () => {
    const result: Record<string, unknown> = {};
    for (const col of COLLECTIONS) {
      const snap = await getDocs(collection(db, `users/${UID}/${col}`));
      result[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ulvi-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg("Exported!");
    setTimeout(() => setExportMsg(""), 3000);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ padding: "24px 24px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Profile & Data</p>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Profile Card */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#e9456022", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={24} color="#e94560" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{profile.job}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Weight", value: `${profile.weight}kg` },
              { label: "Pull Up Max", value: `${profile.baselineMetrics.pullUpMax} reps` },
              { label: "Resting HR", value: `${profile.baselineMetrics.rhr} bpm` },
              { label: "HRV", value: `${profile.baselineMetrics.hrv} ms` },
              { label: "VO2 Max", value: `${profile.baselineMetrics.vo2max}` },
              { label: "10km Pace", value: `${profile.baselineMetrics.tenKmPace}/km` },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "var(--surface-light)", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Goals</p>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "var(--text-muted)" }}>Primary: </span>{profile.goals.primary}
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "var(--text-muted)" }}>Inspired by: </span>
            <span style={{ color: "#e94560" }}>{profile.goals.inspiration}</span>
          </div>
          {profile.goals.secondaryGoals.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#6f42c1", flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{g}</span>
            </div>
          ))}
        </div>

        {/* Marathon Achievement */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #fd7e14" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#fd7e14" }}>
            First Marathon — {profile.achievements.bakuMarathon2026.date}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { label: "Distance", value: `${profile.achievements.bakuMarathon2026.distance}km` },
              { label: "Time", value: profile.achievements.bakuMarathon2026.officialTime },
              { label: "Avg Pace", value: profile.achievements.bakuMarathon2026.avgPace },
              { label: "Avg HR", value: `${profile.achievements.bakuMarathon2026.avgHR} bpm` },
              { label: "Elevation", value: `${profile.achievements.bakuMarathon2026.elevation}m` },
              { label: "Calories", value: profile.achievements.bakuMarathon2026.calories.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "var(--surface-light)", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Posture Focus */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #6f42c1" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Posture Focus</p>
          {profile.postureIssues.map((issue) => (
            <div key={issue} style={{ display: "flex", gap: 8, alignItems: "center", padding: "3px 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#6f42c1", flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>{issue}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            {profile.sittingHours}h/day at desk · {profile.workHours}
          </p>
        </div>

        {/* Nutrition Targets */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Nutrition Targets</p>
          <p style={{ fontSize: 12, color: "#e94560", fontWeight: 600, marginBottom: 6 }}>Training Days</p>
          {Object.entries(nutritionTargets.trainingDays).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ textTransform: "capitalize", color: "var(--text-muted)" }}>{key}</span>
              <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "#0f9b58", fontWeight: 600, margin: "10px 0 6px" }}>Rest Days</p>
          {Object.entries(nutritionTargets.restDays).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ textTransform: "capitalize", color: "var(--text-muted)" }}>{key}</span>
              <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
            </div>
          ))}
        </div>

        {/* Firestore paths */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #0077b6" }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#0077b6" }}>Firestore Collections</p>
          {COLLECTIONS.map((col) => (
            <div key={col} style={{ fontSize: 12, color: "var(--text-muted)", padding: "3px 0" }}>
              users/ulvi/<span style={{ color: "#fff" }}>{col}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Data</p>
          <button onClick={exportData} style={{ width: "100%", padding: 12, backgroundColor: "var(--surface-light)", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <Download size={18} color="#0077b6" />
            <span>Export from Firestore (JSON)</span>
            <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: "auto" }} />
          </button>
          {exportMsg && <p style={{ fontSize: 12, color: "#0f9b58", margin: "8px 0 0" }}>{exportMsg}</p>}
        </div>
      </div>

    </div>
  );
}
