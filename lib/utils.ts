import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayKey(): string {
  return formatDate(new Date());
}

export function getDayOfWeek(date = new Date()): string {
  return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function paceToSeconds(pace: string): number {
  const [min, sec] = pace.split(":").map(Number);
  return min * 60 + sec;
}

export function secondsToPace(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getWeekDates(): { key: string; label: string; date: Date }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days.map((key, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { key, label: labels[i], date: d };
  });
}
