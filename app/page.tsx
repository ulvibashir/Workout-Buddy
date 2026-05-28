"use client";
import Link from "next/link";
import { format } from "date-fns";
import { Scale, Heart, Activity, Zap, ChevronRight, Trophy, TrendingUp, Dumbbell } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import { useFirestoreDoc } from "@/lib/hooks/useFirestoreData";
import { useFirestoreCollection } from "@/lib/hooks/useFirestoreData";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAppData } from "@/components/shared/AppProvider";
import { getDayOfWeek, getTodayKey } from "@/lib/utils";

interface BodyMetric { id: string; weight: string; rhr: string; hrv: string; vo2max: string }
interface PullUpSession { id: string; sets: number[]; maxReps: number; totalReps: number }
interface RunLog { id: string; date: string; distance: number; time: string; avgPace: string; avgHR: number; runType: string }

export default function Dashboard() {
  const today = new Date();
  const dayKey = getDayOfWeek(today);
  const todayKey = getTodayKey();

  const { profile } = useProfile();
  const { workoutDays, quotes } = useAppData();
  const todayWorkout = workoutDays[dayKey];
  const quote = quotes[today.getDate() % Math.max(quotes.length, 1)];

  const { data: completedDays } = useFirestoreDoc<Record<string, boolean>>("workoutLogs", "completed", {} as Record<string, boolean>);
  const { items: bodyMetrics } = useFirestoreCollection<BodyMetric>("bodyMetrics");
  const { items: pullUpLogs } = useFirestoreCollection<PullUpSession>("pullUpLogs");
  const { items: runLogs } = useFirestoreCollection<RunLog>("runningLogs");

  const sortedMetrics = [...bodyMetrics].sort((a, b) => b.id.localeCompare(a.id));
  const latestMetric = sortedMetrics[0];

  const recentRuns = [...runLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const recentPullUps = [...pullUpLogs].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);

  const totalRunKm = runLogs.reduce((a, r) => a + r.distance, 0);
  const allTimeMaxPullUp = pullUpLogs.length
    ? Math.max(...pullUpLogs.map((s) => s.maxReps), profile.baselineMetrics.pullUpMax)
    : profile.baselineMetrics.pullUpMax;

  const completedThisWeek = Object.values(completedDays).filter(Boolean).length;

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 0" }}>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 2 }}>{format(today, "EEEE, MMM d")}</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{profile.name}</h1>
        <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{profile.goals.primary}</p>
        <div style={{ marginTop: 12, padding: "10px 14px", backgroundColor: "#1a1a2e", borderRadius: 10, borderLeft: "3px solid #e94560" }}>
          <p style={{ color: "#9ca3af", fontSize: 12, fontStyle: "italic", margin: 0 }}>"{quote}"</p>
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        {/* Today's Workout */}
        {todayWorkout && (
          <Link href="/workout" style={{ textDecoration: "none" }}>
            <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12, borderLeft: `4px solid ${todayWorkout.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>Today's Session</p>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{todayWorkout.name}</h2>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
                    {todayWorkout.duration} · {todayWorkout.intensity} intensity
                    {completedDays[dayKey] && <span style={{ color: "#0f9b58", marginLeft: 8 }}>· Completed ✓</span>}
                  </p>
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

        {/* Latest Body Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Weight", value: latestMetric?.weight || profile.baselineMetrics.weight, unit: "kg", icon: Scale, color: "#fd7e14" },
            { label: "RHR", value: latestMetric?.rhr || profile.baselineMetrics.rhr, unit: "bpm", icon: Heart, color: "#e94560" },
            { label: "HRV", value: latestMetric?.hrv || profile.baselineMetrics.hrv, unit: "ms", icon: Activity, color: "#0f9b58" },
          ].map(({ label, value, unit, icon: Icon, color }) => (
            <div key={label} style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <Icon size={16} color={color} style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{unit}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Workouts/wk", value: completedThisWeek, unit: "done", color: "#6f42c1" },
            { label: "Pull Up Max", value: allTimeMaxPullUp, unit: "reps", color: "#e94560" },
            { label: "Total km", value: Math.round(totalRunKm), unit: "km", color: "#0077b6" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: "12px 10px", textAlign: "center", borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{unit}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Week Overview */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>This Week</p>
          <div style={{ display: "flex", gap: 6 }}>
            {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((d) => {
              const w = workoutDays[d];
              const isToday = d === dayKey;
              const done = completedDays[d];
              if (!w) return null;
              return (
                <div key={d} style={{ flex: 1, height: 40, borderRadius: 8, backgroundColor: done ? w.color : isToday ? `${w.color}55` : `${w.color}22`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 8, fontWeight: isToday ? 700 : 400, color: done || isToday ? "#fff" : w.color, border: isToday && !done ? `1px solid ${w.color}` : "none" }}>
                  <span>{d.slice(0, 1).toUpperCase()}</span>
                  {done && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Runs */}
        {recentRuns.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Runs</span>
              <Link href="/running" style={{ fontSize: 12, color: "#0077b6", textDecoration: "none" }}>See all</Link>
            </div>
            {recentRuns.map((run) => (
              <div key={run.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2d2d4e" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{run.distance}km</span>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{run.date}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  {run.avgPace && <span style={{ fontSize: 13, color: "#0077b6", fontWeight: 600 }}>{run.avgPace}/km</span>}
                  {run.avgHR > 0 && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{run.avgHR}bpm</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Pull Ups */}
        {recentPullUps.length > 0 && (
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Pull Ups</span>
              <Link href="/pullups" style={{ fontSize: 12, color: "#e94560", textDecoration: "none" }}>See all</Link>
            </div>
            {recentPullUps.map((session) => (
              <div key={session.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2d2d4e" }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{session.id}</span>
                <div>
                  <span style={{ fontSize: 13, color: "#e94560", fontWeight: 700 }}>{session.maxReps} max</span>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{session.totalReps} total</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Marathon Achievement */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 12, borderTop: "3px solid #fd7e14" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Trophy size={18} color="#fd7e14" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>First Marathon — {profile.achievements.bakuMarathon2026.date}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { label: "Distance", value: `${profile.achievements.bakuMarathon2026.distance}km` },
              { label: "Time", value: profile.achievements.bakuMarathon2026.officialTime },
              { label: "Avg Pace", value: `${profile.achievements.bakuMarathon2026.avgPace}/km` },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Read-only notice */}
        <div style={{ padding: "10px 14px", backgroundColor: "#1a1a2e", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={14} color="#9ca3af" />
          <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>Dashboard is read-only. Log workouts & data from the iOS app.</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
