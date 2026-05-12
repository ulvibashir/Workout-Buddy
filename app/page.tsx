"use client";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Scale, Heart, Activity, Zap, ChevronRight, Plus, Trophy } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { WORKOUTS } from "@/lib/data/workouts";
import { QUOTES, ATHLETE } from "@/lib/data/athlete";
import { useFirestoreDoc } from "@/lib/hooks/useFirestoreData";
import { getDayOfWeek, getTodayKey } from "@/lib/utils";

interface QuickMetrics { weight: string; rhr: string; hrv: string }
interface NutritionTotals { calories: number; protein: number; carbs: number; fat: number }

export default function Dashboard() {
  const today = new Date();
  const dayKey = getDayOfWeek(today);
  const todayWorkout = WORKOUTS[dayKey];
  const quote = QUOTES[today.getDate() % QUOTES.length];
  const todayKey = getTodayKey();

  const { data: metrics, save: saveMetrics } = useFirestoreDoc<Record<string, QuickMetrics>>(
    "bodyMetrics", "all", {}
  );
  const { data: nutritionLog } = useFirestoreDoc<Record<string, NutritionTotals>>(
    "nutritionTotals", "all", {}
  );

  const [showQuickLog, setShowQuickLog] = useState(false);
  const [form, setForm] = useState<QuickMetrics>({ weight: "", rhr: "", hrv: "" });

  const todayMetrics = metrics[todayKey];
  const todayNutrition = nutritionLog[todayKey];

  const saveQuickLog = () => {
    saveMetrics({ ...metrics, [todayKey]: form });
    setShowQuickLog(false);
  };

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 2 }}>
              {format(today, "EEEE, MMM d")}
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Hey, {ATHLETE.name} 👋</h1>
          </div>
          <button
            onClick={() => setShowQuickLog(true)}
            style={{ backgroundColor: "#e94560", borderRadius: "50%", width: 40, height: 40, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Plus size={20} color="#fff" />
          </button>
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", backgroundColor: "#1a1a2e", borderRadius: 10, borderLeft: "3px solid #e94560" }}>
          <p style={{ color: "#9ca3af", fontSize: 12, fontStyle: "italic", margin: 0 }}>"{quote}"</p>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {todayWorkout && (
          <Link href="/workout" style={{ textDecoration: "none" }}>
            <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12, borderLeft: `4px solid ${todayWorkout.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's Session</p>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{todayWorkout.name}</h2>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{todayWorkout.duration} · {todayWorkout.intensity} intensity</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", backgroundColor: `${todayWorkout.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={20} color={todayWorkout.color} />
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              </div>
            </div>
          </Link>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Weight", value: todayMetrics?.weight || ATHLETE.baselineMetrics.weight, unit: "kg", icon: Scale, color: "#fd7e14" },
            { label: "RHR", value: todayMetrics?.rhr || ATHLETE.baselineMetrics.rhr, unit: "bpm", icon: Heart, color: "#e94560" },
            { label: "HRV", value: todayMetrics?.hrv || ATHLETE.baselineMetrics.hrv, unit: "ms", icon: Activity, color: "#0f9b58" },
          ].map(({ label, value, unit, icon: Icon, color }) => (
            <div key={label} style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <Icon size={16} color={color} style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{unit}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {todayNutrition && (
          <Link href="/nutrition" style={{ textDecoration: "none" }}>
            <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>Nutrition Today</span>
                <ChevronRight size={16} color="#9ca3af" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { label: "Calories", value: Math.round(todayNutrition.calories), color: "#fd7e14" },
                  { label: "Protein", value: `${Math.round(todayNutrition.protein)}g`, color: "#e94560" },
                  { label: "Carbs", value: `${Math.round(todayNutrition.carbs)}g`, color: "#0077b6" },
                  { label: "Fat", value: `${Math.round(todayNutrition.fat)}g`, color: "#20c997" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        )}

        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderTop: "3px solid #fd7e14" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Trophy size={18} color="#fd7e14" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>First Marathon — May 3, 2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[{ label: "Distance", value: "43.08km" }, { label: "Time", value: "6:39:03" }, { label: "Avg Pace", value: "9:06/km" }].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>This Week</p>
          <div style={{ display: "flex", gap: 6 }}>
            {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((d) => {
              const w = WORKOUTS[d];
              const isToday = d === dayKey;
              return (
                <div key={d} style={{ flex: 1, height: 36, borderRadius: 8, backgroundColor: isToday ? w.color : `${w.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : w.color, border: isToday ? "none" : `1px solid ${w.color}44` }}>
                  {d.slice(0, 1).toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>

        {showQuickLog && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
            <div style={{ backgroundColor: "#1a1a2e", width: "100%", borderRadius: "16px 16px 0 0", padding: 20 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Quick Log — {format(today, "MMM d")}</h3>
              {[
                { field: "weight" as const, label: "Weight (kg)", placeholder: "68" },
                { field: "rhr" as const, label: "Resting HR (bpm)", placeholder: "58" },
                { field: "hrv" as const, label: "HRV (ms)", placeholder: "65" },
              ].map(({ field, label, placeholder }) => (
                <div key={field} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>{label}</label>
                  <input type="number" placeholder={placeholder} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", background: "#242442", border: "1px solid #2d2d4e", borderRadius: 8, color: "#fff", fontSize: 16 }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setShowQuickLog(false)} style={{ flex: 1, padding: 12, background: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer", fontSize: 14 }}>Cancel</button>
                <button onClick={saveQuickLog} style={{ flex: 2, padding: 12, background: "#e94560", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
}
