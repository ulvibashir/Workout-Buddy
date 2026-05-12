"use client";
import { useState } from "react";
import { Plus, Check, Search, X, Trash2 } from "lucide-react";
import Navigation from "@/components/shared/Navigation";
import MacroRing from "@/components/nutrition/MacroRing";
import WaterTracker from "@/components/nutrition/WaterTracker";
import { useAppData } from "@/components/shared/AppProvider";
import { useFirestoreDoc } from "@/lib/hooks/useFirestoreData";
import { getTodayKey, getDayOfWeek } from "@/lib/utils";
import type { FoodItem } from "@/lib/data/nutrition";
import { MEAL_SECTIONS } from "@/lib/data/nutrition";

interface LoggedFood {
  id: string;
  name: string;
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
}

export default function NutritionPage() {
  const { nutritionTargets, supplements, foodDatabase, workoutDays, seeding } = useAppData();
  const todayKey = getTodayKey();
  const dayKey = getDayOfWeek();
  const trainingDay = workoutDays[dayKey]?.intensity !== "Low" && dayKey !== "sunday";
  const targets = trainingDay ? nutritionTargets.trainingDays : nutritionTargets.restDays;

  const { data: dayLog, save: saveDayLog } = useFirestoreDoc<DayLog>(
    "nutritionLogs", todayKey, { foods: [], water: 0, supplements: [] }
  );

  const totals = dayLog.foods.reduce(
    (acc, f) => ({ calories: acc.calories + f.calories, protein: acc.protein + f.protein, carbs: acc.carbs + f.carbs, fat: acc.fat + f.fat }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const [addingMeal, setAddingMeal] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(1);

  const filtered = foodDatabase.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);

  const calcMacros = (food: FoodItem, amount: number) => {
    const scale = food.unit === "100g" ? amount / 100 : amount;
    return { protein: food.protein * scale, carbs: food.carbs * scale, fat: food.fat * scale, calories: food.calories * scale };
  };

  const confirmAdd = () => {
    if (!selectedFood || !addingMeal) return;
    const macros = calcMacros(selectedFood, qty);
    const entry: LoggedFood = {
      id: `${Date.now()}`,
      name: selectedFood.unit === "100g" ? `${selectedFood.name} (${qty}g)` : `${selectedFood.name} ×${qty}`,
      ...macros,
      meal: addingMeal,
    };
    saveDayLog({ ...dayLog, foods: [...dayLog.foods, entry] });
    setSelectedFood(null);
    setSearch("");
    setQty(1);
    setAddingMeal(null);
  };

  const removeFood = (id: string) => saveDayLog({ ...dayLog, foods: dayLog.foods.filter((f) => f.id !== id) });

  const toggleSupplement = (id: string) => {
    const sups = dayLog.supplements.includes(id) ? dayLog.supplements.filter((s) => s !== id) : [...dayLog.supplements, id];
    saveDayLog({ ...dayLog, supplements: sups });
  };

  if (seeding) {
    return (
      <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9ca3af" }}>Loading nutrition data...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Nutrition</h1>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>{trainingDay ? "Training Day" : "Rest Day"} targets</p>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 20, backgroundColor: trainingDay ? "#e9456022" : "#0f9b5822", color: trainingDay ? "#e94560" : "#0f9b58", fontSize: 12, fontWeight: 600 }}>
            {trainingDay ? "Training" : "Rest"}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
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

        <div style={{ marginBottom: 12 }}>
          <WaterTracker current={dayLog.water} target={targets.water} onChange={(v) => saveDayLog({ ...dayLog, water: v })} />
        </div>

        {MEAL_SECTIONS.map((meal) => {
          const mealFoods = dayLog.foods.filter((f) => f.meal === meal);
          const mealCals = mealFoods.reduce((a, f) => a + f.calories, 0);
          return (
            <div key={meal} style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: mealFoods.length > 0 ? 8 : 0 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{meal}</span>
                  {mealFoods.length > 0 && <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>{Math.round(mealCals)} kcal</span>}
                </div>
                <button onClick={() => setAddingMeal(meal)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "#e9456033", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={14} color="#e94560" />
                </button>
              </div>
              {mealFoods.map((f) => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: "1px solid #2d2d4e" }}>
                  <div>
                    <div style={{ fontSize: 13 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>P:{Math.round(f.protein)}g · C:{Math.round(f.carbs)}g · F:{Math.round(f.fat)}g</div>
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

        <div style={{ backgroundColor: "#1a1a2e", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Supplements</p>
          {supplements.map((sup) => {
            const checked = dayLog.supplements.includes(sup.id);
            return (
              <div key={sup.id} onClick={() => toggleSupplement(sup.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #2d2d4e", cursor: "pointer" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? "#0f9b58" : "#2d2d4e"}`, backgroundColor: checked ? "#0f9b58" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {checked && <Check size={12} color="#fff" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, textDecoration: checked ? "line-through" : "none", color: checked ? "#9ca3af" : "#fff" }}>{sup.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{sup.dose} · {sup.timing}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, backgroundColor: sup.priority === "ESSENTIAL" ? "#0f9b5822" : sup.priority === "MEDICAL" ? "#e9456022" : "#0077b622", color: sup.priority === "ESSENTIAL" ? "#0f9b58" : sup.priority === "MEDICAL" ? "#e94560" : "#0077b6" }}>
                  {sup.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>

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
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food..." style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 15, outline: "none" }} />
            </div>
            {!selectedFood ? (
              <div>
                {filtered.map((f) => (
                  <div key={f.id} onClick={() => { setSelectedFood(f); setQty(f.unit === "100g" ? 100 : 1); }} style={{ padding: "10px 0", borderBottom: "1px solid #2d2d4e", cursor: "pointer" }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>per {f.unit}: {f.calories} kcal · P{f.protein}g · C{f.carbs}g · F{f.fat}g</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ backgroundColor: "#242442", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                  <div style={{ fontWeight: 600 }}>{selectedFood.name}</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>
                    {selectedFood.unit === "100g" ? "Amount (grams)" : `Number of ${selectedFood.unit}s`}
                  </label>
                  <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: "100%", padding: "10px 12px", background: "#242442", border: "1px solid #2d2d4e", borderRadius: 8, color: "#fff", fontSize: 16 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 14, backgroundColor: "#242442", borderRadius: 10, padding: 10 }}>
                  {(() => {
                    const m = calcMacros(selectedFood, qty);
                    return [
                      { label: "kcal", value: Math.round(m.calories) },
                      { label: "P", value: `${Math.round(m.protein)}g` },
                      { label: "C", value: `${Math.round(m.carbs)}g` },
                      { label: "F", value: `${Math.round(m.fat)}g` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{value}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{label}</div>
                      </div>
                    ));
                  })()}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setSelectedFood(null)} style={{ flex: 1, padding: 12, background: "#242442", border: "none", borderRadius: 10, color: "#9ca3af", cursor: "pointer" }}>Back</button>
                  <button onClick={confirmAdd} style={{ flex: 2, padding: 12, background: "#e94560", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Add Food</button>
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
