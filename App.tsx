import React, { useState, useEffect } from 'react';
import {
  FitnessGoal,
  FoodItem,
  PlateItem,
  RecipeIngredient,
  UserProfile,
} from './types/nutrition';
import { INITIAL_FOODS } from './data/peruvianFoods';
import { computeGoalMacros } from './utils/calculator';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PlateCombinator } from './components/PlateCombinator';
import { AiCoachPanel } from './components/AiCoachPanel';
import { DishBreakdownModal } from './components/DishBreakdownModal';
import { NutritionLabelModal } from './components/NutritionLabelModal';
import { CustomFoodModal } from './components/CustomFoodModal';
import { ProfileModal } from './components/ProfileModal';
import { WeeklyMenu } from './components/WeeklyMenu';
import { ExerciseRoutine } from './components/ExerciseRoutine';
import { HabitsAndSleep } from './components/HabitsAndSleep';
import {
  Home,
  UtensilsCrossed,
  Bot,
  Calendar,
  Dumbbell,
  CheckCircle,
  Database,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type NavTab = 'inicio' | 'combinador' | 'ai_coach' | 'menu' | 'ejercicio' | 'metas' | 'base_alimentos';

export default function App() {
  // 1. Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nutrifit_perfil');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial profile
    const def = computeGoalMacros(68, 163, 30, 'moderado', 'perdida');
    return {
      nombre: 'Vanessa',
      edad: 30,
      peso: 68,
      talla: 163,
      meta: 60,
      ls: 'moderado',
      goal: 'perdida',
      macros: def.macros,
    };
  });

  const [activeTab, setActiveTab] = useState<NavTab>('combinador');

  // 2. Custom foods and general food bank
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutrifit_custom_foods');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const foodBank: FoodItem[] = [...customFoods, ...INITIAL_FOODS];

  // 3. Current Plate Items
  const [plateItems, setPlateItems] = useState<PlateItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutrifit_plate_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        uid: 'init_1',
        foodId: 20,
        name: 'Pan francés con 2 huevos revueltos',
        portionMultiplier: 1,
        unit: '1 porción',
        kcal: 285,
        p: 15,
        c: 28,
        g: 11,
      },
      {
        uid: 'init_2',
        foodId: 45,
        name: 'Yogur Griego Gloria Natural Sin Azúcar',
        portionMultiplier: 1,
        unit: '1 pote (150g)',
        kcal: 92,
        p: 14,
        c: 4.5,
        g: 1.5,
      },
    ];
  });

  // 4. Weekly Plan State
  const [weeklyPlan, setWeeklyPlan] = useState<Record<number, Record<string, FoodItem | null>>>(() => {
    try {
      const saved = localStorage.getItem('nutrifit_weekly_menu');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Prefill day 0
    const initialMap: Record<number, Record<string, FoodItem | null>> = {};
    for (let i = 0; i < 7; i++) {
      initialMap[i] = {
        desayuno: foodBank.find(f => f.id === 80) || null,
        media_manana: foodBank.find(f => f.id === 45) || null,
        almuerzo: foodBank.find(f => f.id === (i % 2 === 0 ? 1 : 2)) || null,
        media_tarde: foodBank.find(f => f.id === 100) || null,
        cena: foodBank.find(f => f.id === 3) || null,
      };
    }
    return initialMap;
  });

  // Modals state
  const [breakdownModalFood, setBreakdownModalFood] = useState<FoodItem | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nutrifit_perfil', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nutrifit_custom_foods', JSON.stringify(customFoods));
  }, [customFoods]);

  useEffect(() => {
    localStorage.setItem('nutrifit_plate_items', JSON.stringify(plateItems));
  }, [plateItems]);

  useEffect(() => {
    localStorage.setItem('nutrifit_weekly_menu', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  // Dynamic Goal Switch Handler
  const handleGoalChange = (newGoal: FitnessGoal) => {
    const { macros } = computeGoalMacros(
      profile.peso,
      profile.talla,
      profile.edad,
      profile.ls,
      newGoal
    );

    setProfile(prev => ({
      ...prev,
      goal: newGoal,
      macros,
    }));

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.2 },
    });
  };

  // Profile Save Handler
  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
  };

  // Food handlers
  const handleAddToPlate = (food: FoodItem, multiplier = 1) => {
    const newItem: PlateItem = {
      uid: `plate_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      foodId: food.id,
      name: food.n,
      portionMultiplier: multiplier,
      unit: food.u,
      kcal: Math.round(food.kcal * multiplier),
      p: +(food.p * multiplier).toFixed(1),
      c: +(food.c * multiplier).toFixed(1),
      g: +(food.g * multiplier).toFixed(1),
      isComposite: food.isComposite,
    };

    setPlateItems(prev => [newItem, ...prev]);
  };

  const handleAddCustomizedDish = (
    food: FoodItem,
    customIngredients: RecipeIngredient[],
    totals: { kcal: number; p: number; c: number; g: number; totalGrams: number }
  ) => {
    const newItem: PlateItem = {
      uid: `plate_${Date.now()}_custom`,
      foodId: food.id,
      name: `${food.n} (Personalizado ${totals.totalGrams}g)`,
      portionMultiplier: 1,
      unit: `${totals.totalGrams}g`,
      kcal: totals.kcal,
      p: totals.p,
      c: totals.c,
      g: totals.g,
      isComposite: true,
      ingredientsBreakdown: customIngredients.map(ing => ({
        name: ing.name,
        grams: ing.currentGrams,
        kcal: Math.round(ing.kcalPer100g * (ing.currentGrams / 100)),
        p: +(ing.protPer100g * (ing.currentGrams / 100)).toFixed(1),
        c: +(ing.carbPer100g * (ing.currentGrams / 100)).toFixed(1),
        g: +(ing.grasPer100g * (ing.currentGrams / 100)).toFixed(1),
      })),
    };

    setPlateItems(prev => [newItem, ...prev]);
  };

  const handleAddSeparateIngredients = (
    breakdown: Array<{
      name: string;
      grams: number;
      kcal: number;
      p: number;
      c: number;
      g: number;
    }>
  ) => {
    const newItems: PlateItem[] = breakdown.map((item, idx) => ({
      uid: `sep_${Date.now()}_${idx}`,
      foodId: `sep_${idx}`,
      name: item.name,
      portionMultiplier: 1,
      unit: `${item.grams}g`,
      kcal: item.kcal,
      p: item.p,
      c: item.c,
      g: item.g,
    }));

    setPlateItems(prev => [...newItems, ...prev]);
  };

  const handleRemoveFromPlate = (uid: string) => {
    setPlateItems(prev => prev.filter(it => it.uid !== uid));
  };

  const handleClearPlate = () => {
    setPlateItems([]);
  };

  const handleSaveCustomFood = (newFood: FoodItem) => {
    setCustomFoods(prev => [newFood, ...prev]);
  };

  const handleUpdateWeeklyMeal = (day: number, slotKey: string, food: FoodItem | null) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotKey]: food,
      },
    }));
  };

  // Calculations for dashboard
  const { calorieDelta, tdee } = computeGoalMacros(
    profile.peso,
    profile.talla,
    profile.edad,
    profile.ls,
    profile.goal
  );

  const plateTotals = plateItems.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      prot: +(acc.prot + it.p).toFixed(1),
      carb: +(acc.carb + it.c).toFixed(1),
      gras: +(acc.gras + it.g).toFixed(1),
    }),
    { kcal: 0, prot: 0, carb: 0, gras: 0 }
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F2421] pb-24 font-sans">
      {/* Header with goal switch and stats */}
      <Header
        userProfile={profile}
        onGoalChange={handleGoalChange}
        calorieDelta={calorieDelta}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center overflow-x-auto scrollbar-none px-2 sm:px-4">
          <NavButton
            active={activeTab === 'inicio'}
            onClick={() => setActiveTab('inicio')}
            icon={<Home className="w-4 h-4" />}
            label="Inicio"
          />
          <NavButton
            active={activeTab === 'combinador'}
            onClick={() => setActiveTab('combinador')}
            icon={<UtensilsCrossed className="w-4 h-4" />}
            label="🍽️ Mi Plato"
            badge={plateItems.length ? `${plateItems.length}` : undefined}
          />
          <NavButton
            active={activeTab === 'ai_coach'}
            onClick={() => setActiveTab('ai_coach')}
            icon={<Bot className="w-4 h-4" />}
            label="🤖 NutriCoach IA"
            highlight
          />
          <NavButton
            active={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
            icon={<Calendar className="w-4 h-4" />}
            label="Menú Semanal"
          />
          <NavButton
            active={activeTab === 'ejercicio'}
            onClick={() => setActiveTab('ejercicio')}
            icon={<Dumbbell className="w-4 h-4" />}
            label="Ejercicios"
          />
          <NavButton
            active={activeTab === 'metas'}
            onClick={() => setActiveTab('metas')}
            icon={<CheckCircle className="w-4 h-4" />}
            label="Metas & Sueño"
          />
          <NavButton
            active={activeTab === 'base_alimentos'}
            onClick={() => setActiveTab('base_alimentos')}
            icon={<Database className="w-4 h-4" />}
            label="Base Alimentos"
          />
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'inicio' && (
          <DashboardView
            userProfile={profile}
            calorieDelta={calorieDelta}
            tdee={tdee}
          />
        )}

        {activeTab === 'combinador' && (
          <PlateCombinator
            userProfile={profile}
            foodBank={foodBank}
            plateItems={plateItems}
            onAddToPlate={handleAddToPlate}
            onRemoveFromPlate={handleRemoveFromPlate}
            onClearPlate={handleClearPlate}
            onOpenBreakdown={food => setBreakdownModalFood(food)}
            onOpenLabelModal={() => setIsLabelModalOpen(true)}
            onOpenCustomFoodModal={() => setIsCustomFoodModalOpen(true)}
            onOpenAiCoach={() => setActiveTab('ai_coach')}
          />
        )}

        {activeTab === 'ai_coach' && (
          <AiCoachPanel
            userProfile={profile}
            plateItems={plateItems}
            plateTotals={plateTotals}
          />
        )}

        {activeTab === 'menu' && (
          <WeeklyMenu
            userProfile={profile}
            foodBank={foodBank}
            weeklyPlan={weeklyPlan}
            onUpdateWeeklyMeal={handleUpdateWeeklyMeal}
          />
        )}

        {activeTab === 'ejercicio' && (
          <ExerciseRoutine currentLevel={profile.ls} />
        )}

        {activeTab === 'metas' && (
          <HabitsAndSleep userProfile={profile} />
        )}

        {activeTab === 'base_alimentos' && (
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Directorio Completo de Alimentos Peruanos
              </h2>
              <p className="text-xs text-stone-500">
                Platos criollos, productos de supermercado (Metro, Plaza Vea, Tottus), bebidas y snacks
              </p>
            </div>

            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto pr-1">
              {foodBank.map(f => (
                <div key={f.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-stone-800 flex items-center gap-2">
                      {f.n}
                      {f.brand && (
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {f.brand}
                        </span>
                      )}
                      {f.isComposite && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                          Desglosable
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {f.cat} · Porción: {f.u}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-600">{f.kcal} kcal</div>
                    <div className="text-[11px] text-stone-500">
                      P: {f.p}g · C: {f.c}g · G: {f.g}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <DishBreakdownModal
        food={breakdownModalFood}
        isOpen={!!breakdownModalFood}
        onClose={() => setBreakdownModalFood(null)}
        onAddStandardDish={handleAddToPlate}
        onAddCustomizedDish={handleAddCustomizedDish}
        onAddSeparateIngredients={handleAddSeparateIngredients}
      />

      <NutritionLabelModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        onAddFood={handleAddToPlate}
        onSaveToLibrary={handleSaveCustomFood}
      />

      <CustomFoodModal
        isOpen={isCustomFoodModalOpen}
        onClose={() => setIsCustomFoodModalOpen(false)}
        onSaveFood={handleSaveCustomFood}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  badge,
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 py-3.5 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex-shrink-0 cursor-pointer ${
        active
          ? 'border-emerald-700 text-emerald-800 bg-emerald-50/60'
          : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
      } ${highlight && !active ? 'text-emerald-700 font-bold' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}
