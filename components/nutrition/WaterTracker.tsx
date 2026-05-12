"use client";
import { Droplets, Plus, Minus } from "lucide-react";

interface WaterTrackerProps {
  current: number; // liters
  target: number;
  onChange: (val: number) => void;
}

const STEP = 0.25; // 250ml per tap

export default function WaterTracker({ current, target, onChange }: WaterTrackerProps) {
  const pct = Math.min((current / target) * 100, 100);
  const glasses = Math.round(current / STEP);
  const totalGlasses = Math.round(target / STEP);

  return (
    <div style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Droplets size={18} color="#0077b6" />
          <span style={{ fontWeight: 600 }}>Water</span>
        </div>
        <span style={{ color: "#9ca3af", fontSize: 13 }}>{current.toFixed(2)}L / {target}L</span>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        {Array.from({ length: totalGlasses }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 20, height: 24, borderRadius: 4,
              backgroundColor: i < glasses ? "#0077b6" : "#242442",
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onChange(Math.max(0, current - STEP))}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #2d2d4e", background: "#242442", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}
        >
          <Minus size={16} />
        </button>
        <div style={{ flex: 1, height: 8, backgroundColor: "#242442", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, backgroundColor: "#0077b6", transition: "width 0.3s", borderRadius: 4 }} />
        </div>
        <button
          onClick={() => onChange(Math.min(target + 1, current + STEP))}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#0077b6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
