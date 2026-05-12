"use client";
import { useState } from "react";
import { User, Download, Trash2, Info, ChevronRight, Edit2, Check, X } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { NUTRITION_TARGETS } from "@/lib/data/nutrition";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useProfile } from "@/lib/hooks/useProfile";

const UID = "ulvi";
const COLLECTIONS = ["profile", "bodyMetrics", "nutritionLogs", "pullUpLogs", "runningLogs", "workoutLogs"];

export default function SettingsPage() {
  const { profile, loading, save } = useProfile();
  const [exportMsg, setExportMsg] = useState("");
  const [clearing, setClearing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    weight: "",
    job: "",
    workHours: "",
    sittingHours: "",
    goalPrimary: "",
    goalInspiration: "",
    pullUpMax: "",
    rhr: "",
    hrv: "",
    vo2max: "",
    tenKmPace: "",
  });

  const startEdit = () => {
    setForm({
      name: profile.name,
      weight: String(profile.weight),
      job: profile.job,
      workHours: profile.workHours,
      sittingHours: String(profile.sittingHours),
      goalPrimary: profile.goals.primary,
      goalInspiration: profile.goals.inspiration,
      pullUpMax: String(profile.baselineMetrics.pullUpMax),
      rhr: String(profile.baselineMetrics.rhr),
      hrv: String(profile.baselineMetrics.hrv),
      vo2max: String(profile.baselineMetrics.vo2max),
      tenKmPace: profile.baselineMetrics.tenKmPace,
    });
    setEditing(true);
  };

  const saveProfile = () => {
    save({
      ...profile,
      name: form.name,
      weight: parseFloat(form.weight) || profile.weight,
      job: form.job,
      workHours: form.workHours,
      sittingHours: parseInt(form.sittingHours) || profile.sittingHours,
      goals: {
        ...profile.goals,
        primary: form.goalPrimary,
        inspiration: form.goalInspiration,
      },
      baselineMetrics: {
        ...profile.baselineMetrics,
        weight: parseFloat(form.weight) || profile.baselineMetrics.weight,
        pullUpMax: parseInt(form.pullUpMax) || profile.baselineMetrics.pullUpMax,
        rhr: parseInt(form.rhr) || profile.baselineMetrics.rhr,
        hrv: parseInt(form.hrv) || profile.baselineMetrics.hrv,
        vo2max: parseFloat(form.vo2max) || profile.baselineMetrics.vo2max,
        tenKmPace: form.tenKmPace,
      },
    });
    setEditing(false);
  };

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
    setExportMsg("Exported from Firestore!");
    setTimeout(() => setExportMsg(""), 3000);
  };

  const clearAllData = async () => {
    if (!confirm("Delete ALL logged data from Firestore? Profile is kept.")) return;
    setClearing(true);
    const logCollections = ["bodyMetrics", "nutritionLogs", "pullUpLogs", "runningLogs", "workoutLogs"];
    for (const col of logCollections) {
      const snap = await getDocs(collection(db, `users/${UID}/${col}`));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, `users/${UID}/${col}/${d.id}`))));
    }
    setClearing(false);
    alert("All logged data cleared. Profile kept.");
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Settings</h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Profile & Data · Firestore</p>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* Profile Card */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#e9456022", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={24} color="#e94560" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.name}</div>
                <div style={{ color: "#9ca3af", fontSize: 12 }}>{profile.job}</div>
              </div>
            </div>
            <button onClick={startEdit} style={{ background: "#242442", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12 }}>
              <Edit2 size={13} /> Edit
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Weight", value: `${profile.weight}kg` },
              { label: "Pull Up Max", value: `${profile.baselineMetrics.pullUpMax} reps` },
              { label: "RHR Baseline", value: `${profile.baselineMetrics.rhr} bpm` },
              { label: "HRV Baseline", value: `${profile.baselineMetrics.hrv} ms` },
              { label: "VO2 Max", value: `${profile.baselineMetrics.vo2max}` },
              { label: "10km Pace", value: `${profile.baselineMetrics.tenKmPace}/km` },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "#242442", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Goals</p>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "#9ca3af" }}>Primary: </span>{profile.goals.primary}
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "#9ca3af" }}>Inspired by: </span>
            <span style={{ color: "#e94560" }}>{profile.goals.inspiration}</span>
          </div>
          {profile.goals.secondaryGoals.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#6f42c1", flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{g}</span>
            </div>
          ))}
        </div>

        {/* Marathon Achievement */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #fd7e14" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#fd7e14" }}>
            First Marathon — {profile.achievements.bakuMarathon2026.date}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { label: "Distance", value: `${profile.achievements.bakuMarathon2026.distance}km` },
              { label: "Time", value: profile.achievements.bakuMarathon2026.officialTime },
              { label: "Avg Pace", value: profile.achievements.bakuMarathon2026.avgPace + "/km" },
              { label: "Avg HR", value: `${profile.achievements.bakuMarathon2026.avgHR} bpm` },
              { label: "Elevation", value: `${profile.achievements.bakuMarathon2026.elevation}m` },
              { label: "Calories", value: profile.achievements.bakuMarathon2026.calories.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "#242442", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 9, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Posture Issues */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #6f42c1" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Posture Focus</p>
          {profile.postureIssues.map((issue) => (
            <div key={issue} style={{ display: "flex", gap: 8, alignItems: "center", padding: "3px 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#6f42c1", flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>{issue}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
            {profile.sittingHours}h/day at desk · {profile.workHours}
          </p>
        </div>

        {/* Nutrition Targets */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Nutrition Targets</p>
          <p style={{ fontSize: 12, color: "#e94560", fontWeight: 600, marginBottom: 6 }}>Training Days</p>
          {Object.entries(NUTRITION_TARGETS.trainingDays).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #2d2d4e" }}>
              <span style={{ textTransform: "capitalize", color: "#9ca3af" }}>{key}</span>
              <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "#0f9b58", fontWeight: 600, margin: "10px 0 6px" }}>Rest Days</p>
          {Object.entries(NUTRITION_TARGETS.restDays).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #2d2d4e" }}>
              <span style={{ textTransform: "capitalize", color: "#9ca3af" }}>{key}</span>
              <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
            </div>
          ))}
        </div>

        {/* Firestore paths */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #0077b6" }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#0077b6" }}>Firestore Collections</p>
          {COLLECTIONS.map((col) => (
            <div key={col} style={{ fontSize: 12, color: "#9ca3af", padding: "3px 0" }}>
              users/ulvi/<span style={{ color: "#fff" }}>{col}</span>
            </div>
          ))}
        </div>

        {/* Data Actions */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Data</p>
          <button onClick={exportData} style={{ width: "100%", padding: 12, backgroundColor: "#242442", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Download size={18} color="#0077b6" />
            <span>Export from Firestore (JSON)</span>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: "auto" }} />
          </button>
          {exportMsg && <p style={{ fontSize: 12, color: "#0f9b58", margin: "0 0 8px" }}>{exportMsg}</p>}
          <button onClick={clearAllData} disabled={clearing} style={{ width: "100%", padding: 12, backgroundColor: "#e9456011", border: "1px solid #e9456033", borderRadius: 10, color: "#e94560", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <Trash2 size={18} />
            <span>{clearing ? "Clearing..." : "Clear All Logged Data"}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ backgroundColor: "#1a1a2e", width: "100%", borderRadius: "16px 16px 0 0", padding: 20, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Edit Profile</h3>
              <button onClick={() => setEditing(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="#9ca3af" />
              </button>
            </div>

            {[
              { field: "name", label: "Name", type: "text" },
              { field: "weight", label: "Current Weight (kg)", type: "number" },
              { field: "job", label: "Job", type: "text" },
              { field: "workHours", label: "Work Hours", type: "text" },
              { field: "sittingHours", label: "Sitting Hours/Day", type: "number" },
              { field: "goalPrimary", label: "Primary Goal", type: "text" },
              { field: "goalInspiration", label: "Inspiration", type: "text" },
              { field: "pullUpMax", label: "Pull Up Max (reps)", type: "number" },
              { field: "rhr", label: "Resting HR Baseline (bpm)", type: "number" },
              { field: "hrv", label: "HRV Baseline (ms)", type: "number" },
              { field: "vo2max", label: "VO2 Max (ml/kg/min)", type: "number" },
              { field: "tenKmPace", label: "10km Pace (min:sec)", type: "text" },
            ].map(({ field, label, type }) => (
              <div key={field} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>{label}</label>
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", background: "#242442", border: "1px solid #2d2d4e", borderRadius: 8, color: "#fff", fontSize: 15 }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 12, background: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveProfile} style={{ flex: 2, padding: 12, background: "#e94560", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Check size={16} /> Save to Firestore
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
