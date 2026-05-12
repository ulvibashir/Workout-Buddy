"use client";

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  size?: number;
}

export default function MacroRing({ label, current, target, unit, color, size = 80 }: MacroRingProps) {
  const pct = Math.min((current / target) * 100, 100);
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct / 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2d2d4e" strokeWidth={8} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: size * 0.18, fontWeight: 700 }}>{Math.round(current)}</span>
          <span style={{ fontSize: size * 0.12, color: "#9ca3af" }}>/{target}{unit}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
    </div>
  );
}
