import React, { useState, useEffect } from 'react';
import { FoodItem, RecipeIngredient } from '../types/nutrition';
import { calculateCompositeTotals, calculateIngredientMacros } from '../utils/calculator';
import { X, Scale, Layers, CheckCircle2, RotateCcw, Plus, Sparkles, ChefHat } from 'lucide-react';

interface DishBreakdownModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddStandardDish: (food: FoodItem) => void;
  onAddCustomizedDish: (
    food: FoodItem,
    customIngredients: RecipeIngredient[],
    totals: { kcal: number; p: number; c: number; g: number; totalGrams: number }
  ) => void;
  onAddSeparateIngredients: (
    ingredientsWithMacros: Array<{
      name: string;
      grams: number;
      kcal: number;
      p: number;
      c: number;
      g: number;
    }>
  ) => void;
}

export const DishBreakdownModal: React.FC<DishBreakdownModalProps> = ({
  food,
  isOpen,
  onClose,
  onAddStandardDish,
  onAddCustomizedDish,
  onAddSeparateIngredients,
}) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

  useEffect(() => {
    if (food && food.ingredients) {
      // Clone fresh copy
      setIngredients(food.ingredients.map(ing => ({ ...ing })));
    }
  }, [food]);

  if (!isOpen || !food || !food.ingredients) return null;

  const totals = calculateCompositeTotals(ingredients);

  const handleGramChange = (id: string, newGrams: number) => {
    const val = Math.max(0, Math.min(1000, newGrams || 0));
    setIngredients(prev =>
      prev.map(ing => (ing.id === id ? { ...ing, currentGrams: val } : ing))
    );
  };

  const handleReset = () => {
    if (food && food.ingredients) {
      setIngredients(food.ingredients.map(ing => ({ ...ing, currentGrams: ing.baseGrams })));
    }
  };

  const handleSeparateAdd = () => {
    const breakdown = ingredients
      .filter(ing => ing.currentGrams > 0)
      .map(ing => {
        const macros = calculateIngredientMacros(ing, ing.currentGrams);
        return {
          name: `${ing.name} (${macros.grams}g)`,
          grams: macros.grams,
          kcal: macros.kcal,
          p: macros.p,
          c: macros.c,
          g: macros.g,
        };
      });

    onAddSeparateIngredients(breakdown);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                  {food.n}
                </h3>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Receta Desglosable
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {food.recipeDescription || 'Desglose detallado de ingredientes criollos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nutritional Summary Banner */}
        <div className="bg-stone-50 rounded-2xl p-3 sm:p-4 border border-stone-200/70 mb-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Peso total calculado: <strong>{totals.totalGrams}g</strong>
            </span>
            <button
              onClick={handleReset}
              className="text-stone-400 hover:text-emerald-700 text-xs flex items-center gap-1 hover:underline transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar estándar
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white rounded-xl p-2 border border-stone-100 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-rose-600">{totals.kcal}</div>
              <div className="text-[10px] font-medium text-stone-400">kcal</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-stone-100 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-sky-600">{totals.p}g</div>
              <div className="text-[10px] font-medium text-stone-400">Proteínas</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-stone-100 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-amber-600">{totals.c}g</div>
              <div className="text-[10px] font-medium text-stone-400">Carbos</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-stone-100 shadow-2xs">
              <div className="text-base sm:text-lg font-bold text-emerald-600">{totals.g}g</div>
              <div className="text-[10px] font-medium text-stone-400">Grasas</div>
            </div>
          </div>
        </div>

        {/* Ingredients Interactive List */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Pesar ingredientes por separado
            </label>
            <span className="text-[11px] text-stone-400">Ajusta los gramos a tu porción real</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {ingredients.map(ing => {
              const m = calculateIngredientMacros(ing, ing.currentGrams);
              return (
                <div
                  key={ing.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-stone-100 bg-white hover:border-emerald-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                      {ing.name}
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2">
                      <span>{m.kcal} kcal</span>
                      <span>·</span>
                      <span className="text-sky-600 font-medium">P: {m.p}g</span>
                      <span>·</span>
                      <span className="text-amber-600 font-medium">C: {m.c}g</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-medium">G: {m.g}g</span>
                    </div>
                  </div>

                  {/* Grams input controller */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleGramChange(ing.id, ing.currentGrams - 10)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition-colors"
                    >
                      -
                    </button>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="800"
                        value={ing.currentGrams}
                        onChange={e => handleGramChange(ing.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-1.5 py-1 text-center font-mono text-xs font-bold border border-stone-200 rounded-lg bg-stone-50 text-stone-800 focus:outline-emerald-600"
                      />
                      <span className="absolute right-1 top-1 text-[9px] text-stone-400 pointer-events-none">g</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGramChange(ing.id, ing.currentGrams + 10)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => {
              onAddCustomizedDish(food, ingredients, totals);
              onClose();
            }}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Registrar plato completo ({totals.kcal} kcal · {totals.totalGrams}g)</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSeparateAdd}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-stone-600" />
              <span>Desglosar ingredientes al plato</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddStandardDish(food);
                onClose();
              }}
              className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Registrar estándar ({food.kcal} kcal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
