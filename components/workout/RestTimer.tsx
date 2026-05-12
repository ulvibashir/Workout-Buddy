"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface RestTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
}

export default function RestTimer({ defaultSeconds = 90, onComplete }: RestTimerProps) {
  const [total, setTotal] = useState(defaultSeconds);
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            onComplete?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining, onComplete]);

  const pct = (remaining / total) * 100;

  const reset = () => {
    setRunning(false);
    setRemaining(total);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", backgroundColor: "#242442", borderRadius: 8 }}>
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <svg width={32} height={32} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={16} cy={16} r={13} fill="none" stroke="#2d2d4e" strokeWidth={3} />
          <circle
            cx={16} cy={16} r={13} fill="none"
            stroke={remaining === 0 ? "#0f9b58" : "#e94560"}
            strokeWidth={3}
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>
          {remaining}
        </span>
      </div>

      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 36 }}>{formatDuration(remaining)}</span>

      <select
        value={total}
        onChange={(e) => { const v = Number(e.target.value); setTotal(v); setRemaining(v); setRunning(false); }}
        style={{ background: "#1a1a2e", color: "#9ca3af", border: "none", fontSize: 11, borderRadius: 4, padding: "2px 4px" }}
      >
        {[30, 45, 60, 90, 120, 180].map((s) => (
          <option key={s} value={s}>{s}s</option>
        ))}
      </select>

      <button onClick={() => setRunning((r) => !r)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e94560", padding: 2 }}>
        {running ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
