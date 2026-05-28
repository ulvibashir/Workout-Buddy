"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAppData } from "@/components/shared/AppProvider";
import { getDayOfWeek } from "@/lib/utils";
import { FOOD_GUIDE } from "@/lib/data/nutrition";
import type { NutritionMeal } from "@/lib/data/nutrition";

export default function NutritionPage() {
  const { nutritionTargets, supplements, nutritionMeals, workoutDays } = useAppData();
  const dayKey = getDayOfWeek();
  const trainingDay = workoutDays[dayKey]?.intensity !== "Low" && dayKey !== "sunday";
  const targets = trainingDay ? nutritionTargets.trainingDays : nutritionTargets.restDays;
  const meals: NutritionMeal[] = trainingDay ? (nutritionMeals.training ?? []) : (nutritionMeals.rest ?? []);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Nutrition</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {trainingDay ? "Training Day 🔥" : "Rest Day 💤"} plan
          </p>
        </div>
        <div style={{ padding: "4px 10px", borderRadius: 20, backgroundColor: trainingDay ? "#e9456022" : "#0f9b5822", color: trainingDay ? "#e94560" : "#0f9b58", fontSize: 12, fontWeight: 600 }}>
          {trainingDay ? "Training" : "Rest"}
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Macro Targets Card */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 12 }}>
            <MacroColumn label="Protein" value={`${targets.protein}g`} color="#e94560" />
            <div style={{ width: 1, backgroundColor: "var(--border)" }} />
            <MacroColumn label="Carbs" value={`${targets.carbs}g`} color="#0077b6" />
            <div style={{ width: 1, backgroundColor: "var(--border)" }} />
            <MacroColumn label="Fat" value={`${targets.fat}g`} color="#20c997" />
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            ~{targets.calories} kcal · {targets.water}L water
          </div>
        </div>

        {/* Meal Plan */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Daily Meal Plan
          </p>
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        {/* Food Guide */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            Food Guide
          </p>
          <ExpandableFoodSection header="✅ Eat Freely" color="#0f9b58" items={FOOD_GUIDE.eatFreely} />
          <ExpandableFoodSection header="⚠️ Eat in Moderation" color="#fd7e14" items={FOOD_GUIDE.eatModeration} />
          <ExpandableFoodSection header="❌ Avoid" color="#e94560" items={FOOD_GUIDE.avoid} />
        </div>

        {/* Supplement Stack */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Daily Stack</p>
          {supplements.map((sup, i) => (
            <div key={sup.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <span style={{ fontSize: 18 }}>💊</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{sup.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sup.dose} · {sup.timing}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, backgroundColor: sup.priority === "ESSENTIAL" ? "#0f9b5822" : sup.priority === "MEDICAL" ? "#e9456022" : "#0077b622", color: sup.priority === "ESSENTIAL" ? "#0f9b58" : sup.priority === "MEDICAL" ? "#e94560" : "#0077b6" }}>
                  {sup.priority}
                </span>
              </div>
              {i < supplements.length - 1 && <div style={{ height: 1, backgroundColor: "var(--border)" }} />}
            </div>
          ))}
        </div>

        {/* Cheat Day Note */}
        <div style={{ backgroundColor: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 16, borderLeft: "3px solid #e94560" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🎉 Cheat Day — Sunday</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>You've earned it. Keep it reasonable.</p>
          {["Stay within reason — don't binge", "Avoid alcohol — hurts recovery", "Enjoy your meal, restart Monday"].map((rule) => (
            <div key={rule} style={{ display: "flex", gap: 6, padding: "3px 0" }}>
              <span style={{ color: "#e94560" }}>•</span>
              <span style={{ fontSize: 12 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MacroColumn({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MealCard({ meal }: { meal: NutritionMeal }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ backgroundColor: "var(--surface)", borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 14, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <span style={{ fontSize: 20 }}>{meal.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{meal.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{meal.time}</div>
        </div>
        {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 10, paddingTop: 10 }}>{meal.foods}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <MacroChip label="P" value={`${meal.protein}g`} color="#e94560" />
            <MacroChip label="C" value={`${meal.carbs}g`} color="#0077b6" />
            <MacroChip label="F" value={`${meal.fat}g`} color="#20c997" />
          </div>
        </div>
      )}
    </div>
  );
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{value}</span>
    </div>
  );
}

function ExpandableFoodSection({ header, color, items }: { header: string; color: string; items: { name: string; stat: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "var(--surface)", borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color }}>{header}</span>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: "0 14px 12px", borderTop: "1px solid var(--border)" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 13 }}>{item.name}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.stat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
