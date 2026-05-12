"use client";
import { useState } from "react";
import { Plus, Check, Search, X, Trash2 } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import MacroRing from "@/components/nutrition/MacroRing";
import WaterTracker from "@/components/nutrition/WaterTracker";
import { NUTRITION_TARGETS, FOOD_DATABASE, SUPPLEMENTS, MEAL_SECTIONS, type FoodItem } from "@/lib/data/nutrition";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { getTodayKey, getDayOfWeek } from "@/lib/utils";
import { WORKOUTS } from "@/lib/data/workouts";

interface LoggedFood {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  meal: string;
}

interface DayLog {
  foods: LoggedFood[];
  water: number;
  supplements: string[];
  isTrainingDay?: boolean;
}

function getDefaultLog(): DayLog {
  return { foods: [], water: 0, supplements: [] };
}

export default function NutritionPage() {
  const todayKey = getTodayKey();
  const dayKey = getDayOfWeek();
  const trainingDay = WORKOUTS[dayKey]?.intensity !== "Low" && dayKey !== "sunday";

  const [logs, setLogs] = useLocalStorage<Record<string, DayLog>>("nutrition_logs", {});
  const dayLog: DayLog = logs[todayKey] || getDefaultLog();

  const targets = trainingDay ? NUTRITION_TARGETS.trainingDays : NUTRITION_TARGETS.restDays;

  const updateLog = (updated: DayLog) => {
    setLogs({ ...logs, [todayKey]: updated });
  };

  // Totals
  const totals = dayLog.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Add food modal state
  const [addingMeal, setAddingMeal] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(1);

  const filtered = FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);

  const confirmAdd = () => {
    if (!selectedFood || !addingMeal) return;
    const scale = qty;
    const entry: LoggedFood = {
      id: `${Date.now()}`,
      name: `${selectedFood.name} (${qty}${selectedFood.unit === "100g" ? "g" : `×${selectedFood.unit}`})`,
      quantity: qty,
      unit: selectedFood.unit,
      protein: (selectedFood.protein * scale) / (selectedFood.unit === "100g" ? 100 : 1),
      carbs: (selectedFood.carbs * scale) / (selectedFood.unit === "100g" ? 100 : 1),
      fat: (selectedFood.fat * scale) / (selectedFood.unit === "100g" ? 100 : 1),
      calories: (selectedFood.calories * scale) / (selectedFood.unit === "100g" ? 100 : 1),
      meal: addingMeal,
    };
    if (selectedFood.unit === "100g") {
      entry.protein = (selectedFood.protein / 100) * qty;
      entry.carbs = (selectedFood.carbs / 100) * qty;
      entry.fat = (selectedFood.fat / 100) * qty;
      entry.calories = (selectedFood.calories / 100) * qty;
      entry.name = `${selectedFood.name} (${qty}g)`;
    } else {
      entry.protein = selectedFood.protein * qty;
      entry.carbs = selectedFood.carbs * qty;
      entry.fat = selectedFood.fat * qty;
      entry.calories = selectedFood.calories * qty;
      entry.name = `${selectedFood.name} ×${qty}`;
    }
    updateLog({ ...dayLog, foods: [...dayLog.foods, entry] });
    setSelectedFood(null);
    setSearch("");
    setQty(1);
    setAddingMeal(null);
  };

  const removeFood = (id: string) => {
    updateLog({ ...dayLog, foods: dayLog.foods.filter((f) => f.id !== id) });
  };

  const toggleSupplement = (id: string) => {
    const sups = dayLog.supplements.includes(id)
      ? dayLog.supplements.filter((s) => s !== id)
      : [...dayLog.supplements, id];
    updateLog({ ...dayLog, supplements: sups });
  };

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Nutrition</h1>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
              {trainingDay ? "Training Day" : "Rest Day"} targets
            </p>
          </div>
          <div style={{
            padding: "4px 10px", borderRadius: 20,
            backgroundColor: trainingDay ? "#e9456022" : "#0f9b5822",
            color: trainingDay ? "#e94560" : "#0f9b58",
            fontSize: 12, fontWeight: 600,
          }}>
            {trainingDay ? "Training" : "Rest"}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Macro Rings */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{Math.round(totals.calories)}</span>
            <span style={{ color: "#9ca3af", fontSize: 14 }}> / {targets.calories} kcal</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <MacroRing label="Protein" current={totals.protein} target={targets.protein} unit="g" color="#e94560" />
            <MacroRing label="Carbs" current={totals.carbs} target={targets.carbs} unit="g" color="#0077b6" />
            <MacroRing label="Fat" current={totals.fat} target={targets.fat} unit="g" color="#20c997" />
          </div>
        </div>

        {/* Water Tracker */}
        <div style={{ marginBottom: 12 }}>
          <WaterTracker
            current={dayLog.water}
            target={targets.water}
            onChange={(v) => updateLog({ ...dayLog, water: v })}
          />
        </div>

        {/* Meal Sections */}
        {MEAL_SECTIONS.map((meal) => {
          const mealFoods = dayLog.foods.filter((f) => f.meal === meal);
          const mealCalories = mealFoods.reduce((a, f) => a + f.calories, 0);
          return (
            <div key={meal} style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: mealFoods.length > 0 ? 8 : 0 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{meal}</span>
                  {mealFoods.length > 0 && (
                    <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>{Math.round(mealCalories)} kcal</span>
                  )}
                </div>
                <button
                  onClick={() => setAddingMeal(meal)}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "#e9456033", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Plus size={14} color="#e94560" />
                </button>
              </div>
              {mealFoods.map((f) => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: "1px solid #2d2d4e" }}>
                  <div>
                    <div style={{ fontSize: 13 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      P:{Math.round(f.protein)}g · C:{Math.round(f.carbs)}g · F:{Math.round(f.fat)}g
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{Math.round(f.calories)} kcal</span>
                    <button onClick={() => removeFood(f.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Trash2 size={14} color="#9ca3af" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* Supplements */}
        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Supplements</p>
          {SUPPLEMENTS.map((sup) => {
            const checked = dayLog.supplements.includes(sup.id);
            return (
              <div
                key={sup.id}
                onClick={() => toggleSupplement(sup.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
                  borderBottom: "1px solid #2d2d4e", cursor: "pointer",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${checked ? "#0f9b58" : "#2d2d4e"}`,
                  backgroundColor: checked ? "#0f9b58" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {checked && <Check size={12} color="#fff" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, textDecoration: checked ? "line-through" : "none", color: checked ? "#9ca3af" : "#fff" }}>
                    {sup.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{sup.dose} · {sup.timing}</div>
                </div>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 8,
                  backgroundColor: sup.priority === "ESSENTIAL" ? "#0f9b5822" : sup.priority === "MEDICAL" ? "#e9456022" : "#0077b622",
                  color: sup.priority === "ESSENTIAL" ? "#0f9b58" : sup.priority === "MEDICAL" ? "#e94560" : "#0077b6",
                }}>
                  {sup.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {addingMeal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ backgroundColor: "#1a1a2e", width: "100%", borderRadius: "16px 16px 0 0", padding: 20, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Add to {addingMeal}</h3>
              <button onClick={() => { setAddingMeal(null); setSelectedFood(null); setSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="#9ca3af" />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "#242442", borderRadius: 10, marginBottom: 12 }}>
              <Search size={16} color="#9ca3af" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food..."
                style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 15, outline: "none" }}
              />
            </div>

            {!selectedFood ? (
              <div>
                {filtered.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => { setSelectedFood(f); setQty(f.unit === "100g" ? 100 : 1); }}
                    style={{ padding: "10px 0", borderBottom: "1px solid #2d2d4e", cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      per {f.unit === "100g" ? "100g" : f.unit}: {f.calories} kcal · P{f.protein}g · C{f.carbs}g · F{f.fat}g
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ backgroundColor: "#242442", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{selectedFood.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Per {selectedFood.unit === "100g" ? "100g" : selectedFood.unit}</div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>
                    {selectedFood.unit === "100g" ? "Amount (grams)" : `Number of ${selectedFood.unit}s`}
                  </label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "#242442", border: "1px solid #2d2d4e", borderRadius: 8, color: "#fff", fontSize: 16 }}
                  />
                </div>

                {/* Preview */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 14, backgroundColor: "#242442", borderRadius: 10, padding: 10 }}>
                  {[
                    { label: "kcal", value: Math.round(selectedFood.unit === "100g" ? (selectedFood.calories / 100) * qty : selectedFood.calories * qty) },
                    { label: "P", value: `${Math.round(selectedFood.unit === "100g" ? (selectedFood.protein / 100) * qty : selectedFood.protein * qty)}g` },
                    { label: "C", value: `${Math.round(selectedFood.unit === "100g" ? (selectedFood.carbs / 100) * qty : selectedFood.carbs * qty)}g` },
                    { label: "F", value: `${Math.round(selectedFood.unit === "100g" ? (selectedFood.fat / 100) * qty : selectedFood.fat * qty)}g` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{value}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setSelectedFood(null)} style={{ flex: 1, padding: 12, background: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer" }}>
                    Back
                  </button>
                  <button onClick={confirmAdd} style={{ flex: 2, padding: 12, background: "#e94560", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                    Add Food
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
