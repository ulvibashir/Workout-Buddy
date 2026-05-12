"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  unit: string;
  prev?: number | string;
  color?: string;
  lowerIsBetter?: boolean;
}

export default function MetricCard({ label, value, unit, prev, color = "#e94560", lowerIsBetter }: MetricCardProps) {
  const numVal = typeof value === "string" ? parseFloat(value) : value;
  const numPrev = prev !== undefined ? (typeof prev === "string" ? parseFloat(prev as string) : prev) : undefined;

  let trend: "up" | "down" | "flat" = "flat";
  if (numPrev !== undefined && !isNaN(numVal) && !isNaN(numPrev as number)) {
    if (numVal > (numPrev as number)) trend = "up";
    else if (numVal < (numPrev as number)) trend = "down";
  }

  const positive = lowerIsBetter ? trend === "down" : trend === "up";
  const negative = lowerIsBetter ? trend === "up" : trend === "down";

  return (
    <div style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: "14px 16px", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700 }}>{value}</span>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>{unit}</span>
      </div>
      {trend !== "flat" && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
          {trend === "up" ? (
            <TrendingUp size={14} color={positive ? "#0f9b58" : "#e94560"} />
          ) : trend === "down" ? (
            <TrendingDown size={14} color={positive ? "#0f9b58" : "#e94560"} />
          ) : (
            <Minus size={14} color="#9ca3af" />
          )}
          <span style={{ color: positive ? "#0f9b58" : negative ? "#e94560" : "#9ca3af" }}>
            vs last entry
          </span>
        </div>
      )}
    </div>
  );
}
