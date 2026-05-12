"use client";
import { useState } from "react";
import { User, Download, Trash2, Info, ChevronRight } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { ATHLETE } from "@/lib/data/athlete";
import { NUTRITION_TARGETS } from "@/lib/data/nutrition";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const UID = "ulvi";
const COLLECTIONS = ["bodyMetrics", "nutritionLogs", "pullUpLogs", "runningLogs", "workoutLogs"];

export default function SettingsPage() {
  const [exportMsg, setExportMsg] = useState("");
  const [clearing, setClearing] = useState(false);

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
    if (!confirm("Delete ALL data from Firestore? This cannot be undone.")) return;
    setClearing(true);
    for (const col of COLLECTIONS) {
      const snap = await getDocs(collection(db, `users/${UID}/${col}`));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, `users/${UID}/${col}/${d.id}`))));
    }
    setClearing(false);
    alert("All Firestore data cleared.");
  };

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Settings</h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>Profile & Data</p>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Profile Card */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#e9456022", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={24} color="#e94560" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{ATHLETE.name}</div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>{ATHLETE.job}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Weight", value: `${ATHLETE.weight}kg` },
              { label: "Goal", value: "Hybrid Athlete" },
              { label: "Pull Up Max", value: "10 reps" },
              { label: "Marathon", value: "6:39:03" },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "#242442", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Targets */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Nutrition Targets</p>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: "#e94560", fontWeight: 600, marginBottom: 6 }}>Training Days</p>
            {Object.entries(NUTRITION_TARGETS.trainingDays).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #2d2d4e" }}>
                <span style={{ textTransform: "capitalize", color: "#9ca3af" }}>{key}</span>
                <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#0f9b58", fontWeight: 600, marginBottom: 6 }}>Rest Days</p>
            {Object.entries(NUTRITION_TARGETS.restDays).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #2d2d4e" }}>
                <span style={{ textTransform: "capitalize", color: "#9ca3af" }}>{key}</span>
                <span style={{ fontWeight: 600 }}>{val}{key === "water" ? "L" : key === "calories" ? " kcal" : "g"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posture Goals */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #6f42c1" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Posture Goals</p>
          {ATHLETE.postureIssues.map((issue) => (
            <div key={issue} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#6f42c1", flexShrink: 0 }} />
              <span style={{ fontSize: 13 }}>Fix {issue}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Key: Hip flexor stretch + glute activation every session</p>
        </div>

        {/* Firestore path info */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderLeft: "3px solid #0077b6" }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#0077b6" }}>Firestore Storage</p>
          {COLLECTIONS.map((col) => (
            <div key={col} style={{ fontSize: 12, color: "#9ca3af", padding: "3px 0" }}>
              users/ulvi/<span style={{ color: "#fff" }}>{col}</span>
            </div>
          ))}
        </div>

        {/* Data Actions */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Data</p>
          <button onClick={exportData} style={{ width: "100%", padding: 12, backgroundColor: "#242442", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Download size={18} color="#0077b6" />
            <span>Export from Firestore (JSON)</span>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: "auto" }} />
          </button>
          {exportMsg && <p style={{ fontSize: 12, color: "#0f9b58", margin: "0 0 8px" }}>{exportMsg}</p>}
          <button onClick={clearAllData} disabled={clearing} style={{ width: "100%", padding: 12, backgroundColor: "#e9456011", border: "1px solid #e9456033", borderRadius: 10, color: "#e94560", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <Trash2 size={18} />
            <span>{clearing ? "Clearing..." : "Clear All Firestore Data"}</span>
          </button>
        </div>

        {/* About */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Info size={16} color="#9ca3af" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>About</span>
          </div>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>Ulvi — Hybrid Athlete Dashboard</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Built for Ulvi. Inspired by Arda Saatci (Red Bull Cyborg).</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>Goal: Baku → Sub-7 pace, 20+ pull ups.</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
