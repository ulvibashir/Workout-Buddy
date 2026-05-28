export const NUTRITION_TARGETS = {
  trainingDays: {
    calories: 2900,
    protein: 136,
    carbs: 325,
    fat: 75,
    fiber: 32,
    water: 3.5,
  },
  restDays: {
    calories: 2300,
    protein: 136,
    carbs: 225,
    fat: 70,
    fiber: 32,
    water: 3.0,
  },
};

export interface FoodItem {
  id: string;
  name: string;
  unit: string;
  unitAmount: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  fiber?: number;
}

export const FOOD_DATABASE: FoodItem[] = [
  // Proteins
  { id: "chicken_breast", name: "Chicken Breast (raw)", unit: "100g", unitAmount: 100, protein: 23, carbs: 0, fat: 2, calories: 110 },
  { id: "boiled_egg", name: "Boiled Egg", unit: "egg", unitAmount: 1, protein: 6, carbs: 0, fat: 5, calories: 70 },
  { id: "salmon", name: "Salmon (raw)", unit: "100g", unitAmount: 100, protein: 22, carbs: 0, fat: 13, calories: 208 },
  { id: "greek_yogurt", name: "Greek Yogurt", unit: "100g", unitAmount: 100, protein: 10, carbs: 4, fat: 2, calories: 73 },
  { id: "cottage_cheese", name: "Cottage Cheese", unit: "100g", unitAmount: 100, protein: 12, carbs: 3, fat: 2, calories: 72 },
  { id: "tuna", name: "Tuna (canned)", unit: "100g", unitAmount: 100, protein: 22, carbs: 0, fat: 2, calories: 108 },
  { id: "beef_lean", name: "Beef (lean raw)", unit: "100g", unitAmount: 100, protein: 26, carbs: 0, fat: 8, calories: 175 },
  // Carbs
  { id: "white_rice", name: "White Rice (raw)", unit: "100g", unitAmount: 100, protein: 7, carbs: 78, fat: 1, calories: 360 },
  { id: "bulgur", name: "Bulgur (raw)", unit: "100g", unitAmount: 100, protein: 12, carbs: 72, fat: 1, calories: 342 },
  { id: "buckwheat", name: "Buckwheat/Qarabasaq (raw)", unit: "100g", unitAmount: 100, protein: 13, carbs: 72, fat: 3, calories: 343 },
  { id: "oats", name: "Oats/Musli (raw)", unit: "100g", unitAmount: 100, protein: 12, carbs: 56, fat: 4, calories: 373 },
  { id: "sweet_potato", name: "Sweet Potato (raw)", unit: "100g", unitAmount: 100, protein: 2, carbs: 20, fat: 0, calories: 86 },
  { id: "potato_boiled", name: "Potato boiled", unit: "100g", unitAmount: 100, protein: 2, carbs: 17, fat: 0, calories: 77 },
  { id: "pasta", name: "Pasta (raw)", unit: "100g", unitAmount: 100, protein: 13, carbs: 75, fat: 2, calories: 371 },
  { id: "whole_grain_bread", name: "Whole Grain Bread", unit: "slice", unitAmount: 1, protein: 3.5, carbs: 19, fat: 1, calories: 80 },
  { id: "banana", name: "Banana", unit: "banana", unitAmount: 1, protein: 1, carbs: 27, fat: 0, calories: 105 },
  { id: "honey", name: "Honey", unit: "tbsp", unitAmount: 1, protein: 0, carbs: 17, fat: 0, calories: 64 },
  { id: "dates", name: "Dates", unit: "date", unitAmount: 1, protein: 0.2, carbs: 7, fat: 0, calories: 20 },
  // Fats
  { id: "avocado", name: "Avocado", unit: "half", unitAmount: 1, protein: 1, carbs: 6, fat: 15, calories: 160 },
  { id: "olive_oil", name: "Olive Oil", unit: "tbsp", unitAmount: 1, protein: 0, carbs: 0, fat: 14, calories: 119 },
  { id: "almonds", name: "Almonds", unit: "30g", unitAmount: 30, protein: 6, carbs: 6, fat: 15, calories: 173 },
  { id: "peanut_butter", name: "Peanut Butter", unit: "tbsp", unitAmount: 1, protein: 4, carbs: 3, fat: 8, calories: 94 },
  // Drinks
  { id: "ayran", name: "Ayran", unit: "200ml", unitAmount: 200, protein: 4, carbs: 4, fat: 2, calories: 52 },
  { id: "black_tea", name: "Black Tea", unit: "200ml", unitAmount: 200, protein: 0, carbs: 0, fat: 0, calories: 2 },
  { id: "coffee", name: "Coffee (black)", unit: "200ml", unitAmount: 200, protein: 0, carbs: 0, fat: 0, calories: 5 },
];

export const SUPPLEMENTS = [
  { id: "creatine", name: "Creatine Monohydrate", dose: "5g", timing: "Any time — consistency matters", priority: "ESSENTIAL" },
  { id: "vit_d3", name: "Vitamin D3 + K2", dose: "3000 IU D3 + 100mcg K2", timing: "Morning with fat source", priority: "ESSENTIAL" },
  { id: "magnesium", name: "Magnesium Glycinate", dose: "300-400mg", timing: "Before bed", priority: "ESSENTIAL" },
  { id: "omega3", name: "Omega 3 Fish Oil", dose: "2-3g EPA+DHA", timing: "With any meal", priority: "ESSENTIAL" },
  { id: "vit_b", name: "Vitamin B Complex", dose: "1 tablet", timing: "Morning with food", priority: "USEFUL" },
  { id: "iron", name: "Iron Bisglycinate", dose: "As prescribed", timing: "Away from omeprazole", priority: "MEDICAL" },
  { id: "omeprazole", name: "Omeprazole", dose: "As prescribed", timing: "30 min before meal", priority: "MEDICAL" },
];

export const MEAL_SECTIONS = ["Breakfast", "Snack", "Lunch", "Pre-workout", "Post-workout", "Dinner"];

export interface NutritionMeal {
  id: string;
  emoji: string;
  time: string;
  name: string;
  foods: string;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEAL_PLAN: { training: NutritionMeal[]; rest: NutritionMeal[] } = {
  training: [
    { id: "t1", emoji: "🌅", time: "07:00", name: "Breakfast", foods: "Oats 80g + 3 boiled eggs + banana + black tea", protein: 32, carbs: 75, fat: 15 },
    { id: "t2", emoji: "🏋️", time: "12:00", name: "Pre-Workout", foods: "Banana + rice cakes 60g + coffee (black)", protein: 6, carbs: 55, fat: 2 },
    { id: "t3", emoji: "💪", time: "14:30", name: "Post-Workout", foods: "Chicken breast 200g + white rice 150g + salad", protein: 50, carbs: 90, fat: 6 },
    { id: "t4", emoji: "🍽️", time: "19:00", name: "Dinner", foods: "Salmon 200g + buckwheat 120g + grilled vegetables", protein: 44, carbs: 72, fat: 30 },
    { id: "t5", emoji: "🌙", time: "21:30", name: "Evening Snack", foods: "Greek yogurt 200g + almonds 20g + honey drizzle", protein: 24, carbs: 20, fat: 14 },
  ],
  rest: [
    { id: "r1", emoji: "🌅", time: "08:00", name: "Breakfast", foods: "3 eggs + avocado toast + cottage cheese 150g", protein: 38, carbs: 28, fat: 22 },
    { id: "r2", emoji: "🥗", time: "13:00", name: "Lunch", foods: "Chicken breast 180g + buckwheat 100g + salad with olive oil", protein: 44, carbs: 62, fat: 16 },
    { id: "r3", emoji: "🍽️", time: "19:00", name: "Dinner", foods: "Beef lean 180g + sweet potato 200g + steamed vegetables", protein: 47, carbs: 55, fat: 14 },
    { id: "r4", emoji: "🌙", time: "21:30", name: "Evening Snack", foods: "Greek yogurt 200g + berries", protein: 22, carbs: 18, fat: 4 },
  ],
};

export const FOOD_GUIDE = {
  eatFreely: [
    { name: "Chicken Breast", stat: "31g protein / 100g" },
    { name: "Eggs", stat: "6g protein / egg" },
    { name: "Salmon", stat: "22g protein / 100g" },
    { name: "Greek Yogurt", stat: "10g protein / 100g" },
    { name: "Leafy Greens", stat: "Low cal, high fiber" },
    { name: "Cucumber / Tomato", stat: "Hydration + micronutrients" },
  ],
  eatModeration: [
    { name: "White Rice", stat: "78g carbs / 100g dry" },
    { name: "Buckwheat", stat: "72g carbs / 100g dry" },
    { name: "Whole Grain Bread", stat: "2 slices max" },
    { name: "Peanut Butter", stat: "2 tbsp = 190 kcal" },
    { name: "Dates", stat: "7g carbs / date" },
  ],
  avoid: [
    { name: "Alcohol", stat: "Kills recovery + sleep" },
    { name: "Fried Food", stat: "Inflammatory fats" },
    { name: "Sugary Drinks", stat: "Empty calories" },
    { name: "Ultra-Processed Snacks", stat: "No micronutrients" },
  ],
};
