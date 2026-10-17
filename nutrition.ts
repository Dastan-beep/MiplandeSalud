export type FitnessGoal = 'perdida' | 'ganancia';

export type LifestyleLevel = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'deportista' | 'embarazo';

export interface MacroGoals {
  kcal: number;
  prot: number; // in grams
  carb: number; // in grams
  gras: number; // in grams
}

export interface UserProfile {
  nombre: string;
  edad: number;
  peso: number; // kg
  talla: number; // cm
  meta: number; // kg
  ls: LifestyleLevel;
  goal: FitnessGoal;
  macros: MacroGoals;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  currentGrams: number;
  baseGrams: number;
  kcalPer100g: number;
  protPer100g: number;
  carbPer100g: number;
  grasPer100g: number;
}

export interface FoodItem {
  id: string | number;
  n: string; // Name
  cat: 'Platos peruanos' | 'Supermercado' | 'Desayuno' | 'Bebidas' | 'Snacks' | 'Personalizados' | 'Etiquetas';
  kcal: number;
  p: number; // Protein
  c: number; // Carbs
  g: number; // Fats
  u: string; // Unit description: "1 plato", "100g", "1 porción", etc.
  brand?: string;
  isCustom?: boolean;
  isComposite?: boolean;
  recipeDescription?: string;
  ingredients?: RecipeIngredient[];
}

export interface PlateItem {
  uid: string; // unique entry id
  foodId: string | number;
  name: string;
  portionMultiplier: number;
  portionGrams?: number;
  unit: string;
  kcal: number;
  p: number;
  c: number;
  g: number;
  isComposite?: boolean;
  ingredientsBreakdown?: {
    name: string;
    grams: number;
    kcal: number;
    p: number;
    c: number;
    g: number;
  }[];
}

export interface NutritionLabelInput {
  name: string;
  brand: string;
  basis: '100g' | 'serving';
  servingGrams: number;
  kcal: number;
  prot: number;
  carb: number;
  gras: number;
  fiber?: number;
  consumedGrams: number;
  saveToLibrary: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  level: LifestyleLevel[];
  kcal: number;
  sets: string;
  col: string;
  ico: string;
  desc: string;
  ytq: string;
}

export interface DailyGoalCheck {
  t: string;
  s: string;
}
