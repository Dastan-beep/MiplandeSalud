import React, { useState } from 'react';
import { FoodItem, PlateItem, UserProfile } from '../types/nutrition';
import {
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Tag,
  BookmarkPlus,
  Search,
  Scale,
  ChefHat,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  UtensilsCrossed,
} from 'lucide-react';

interface PlateCombinatorProps {
  userProfile: UserProfile | null;
  foodBank: FoodItem[];
  plateItems: PlateItem[];
  onAddToPlate: (food: FoodItem, gramsOrMultiplier?: number) => void;
  onRemoveFromPlate: (uid: string) => void;
  onClearPlate: () => void;
  onOpenBreakdown: (food: FoodItem) => void;
  onOpenLabelModal: () => void;
  onOpenCustomFoodModal: () => void;
  onOpenAiCoach: () => void;
}

export const PlateCombinator: React.FC<PlateCombinatorProps> = ({
  userProfile,
  foodBank,
  plateItems,
  onAddToPlate,
  onRemoveFromPlate,
  onClearPlate,
  onOpenBreakdown,
  onOpenLabelModal,
  onOpenCustomFoodModal,
  onOpenAiCoach,
}) => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');

  const categories = [
    'Todos',
    'Platos peruanos',
    'Supermercado',
    'Desayuno',
    'Bebidas',
    'Snacks',
    'Personalizados',
  ];

  // Calculate plate totals
  const totals = plateItems.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      prot: +(acc.prot + it.p).toFixed(1),
      carb: +(acc.carb + it.c).toFixed(1),
      gras: +(acc.gras + it.g).toFixed(1),
    }),
    { kcal: 0, prot: 0, carb: 0, gras: 0 }
  );

  const targetMacros = userProfile?.macros || {
    kcal: 1600,
    prot: 120,
    carb: 160,
    gras: 45,
  };

  const filteredFoods = foodBank.filter(f => {
    const matchesCat =
      activeCat === 'Todos' ||
      f.cat === activeCat ||
      (activeCat === 'Personalizados' && (f.isCustom || f.cat === 'Personalizados' || f.cat === 'Etiquetas'));
    const matchesSearch =
      f.n.toLowerCase().includes(search.toLowerCase()) ||
      (f.brand && f.brand.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Target Macros Status Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Metas del Día · Balance en Tiempo Real
            </h3>
            <p className="text-xs text-stone-600">
              Objetivo:{' '}
              <span className="font-semibold text-emerald-800">
                {userProfile?.goal === 'ganancia' ? 'Ganancia Muscular' : 'Pérdida de Grasa'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiCoach}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evaluar con NutriCoach IA</span>
            </button>
          </div>
        </div>

        {/* 4 Macro Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Calories */}
          <MacroBar
            label="Calorías totales"
            current={totals.kcal}
            target={targetMacros.kcal}
            unit="kcal"
            color="rose"
          />

          {/* Protein */}
          <MacroBar
            label="Proteína (Preservación/Masa)"
            current={totals.prot}
            target={targetMacros.prot}
            unit="g"
            color="sky"
          />

          {/* Carbs */}
          <MacroBar
            label="Carbohidratos (Energía)"
            current={totals.carb}
            target={targetMacros.carb}
            unit="g"
            color="amber"
          />

          {/* Fats */}
          <MacroBar
            label="Grasas saludables"
            current={totals.gras}
            target={targetMacros.gras}
            unit="g"
            color="emerald"
          />
        </div>
      </div>

      {/* The Current Plate Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-600/30 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
                Mi Plato de Hoy
              </h2>
              <span className="text-xs text-stone-500">
                {plateItems.length} {plateItems.length === 1 ? 'alimento registrado' : 'alimentos registrados'}
              </span>
            </div>
          </div>

          {plateItems.length > 0 && (
            <button
              onClick={onClearPlate}
              className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
          )}
        </div>

        {/* Plate Items List */}
        {plateItems.length === 0 ? (
          <div className="text-center py-8 text-stone-400 space-y-2">
            <p className="text-sm">Tu plato está vacío aún.</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Selecciona platos peruanos o productos de supermercado de abajo, usa el desglose de receta o ingresa por etiqueta nutricional.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
            {plateItems.map(item => (
              <div
                key={item.uid}
                className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                      {item.name}
                    </span>
                    {item.isComposite && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        Compuesto
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-rose-600">{item.kcal} kcal</span>
                    <span>·</span>
                    <span className="text-sky-700 font-medium">P: {item.p}g</span>
                    <span>·</span>
                    <span className="text-amber-700 font-medium">C: {item.c}g</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">G: {item.g}g</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFromPlate(item.uid)}
                  className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  title="Eliminar de mi plato"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Live Plate Totals Box */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-center">
          <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100">
            <div className="text-base sm:text-lg font-bold text-rose-600">{totals.kcal}</div>
            <div className="text-[10px] uppercase font-semibold text-stone-500">kcal</div>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100">
            <div className="text-base sm:text-lg font-bold text-sky-600">{totals.prot}g</div>
            <div className="text-[10px] uppercase font-semibold text-stone-500">Proteína</div>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100">
            <div className="text-base sm:text-lg font-bold text-amber-600">{totals.carb}g</div>
            <div className="text-[10px] uppercase font-semibold text-stone-500">Carbos</div>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100">
            <div className="text-base sm:text-lg font-bold text-emerald-600">{totals.gras}g</div>
            <div className="text-[10px] uppercase font-semibold text-stone-500">Grasas</div>
          </div>
        </div>
      </div>

      {/* Dual Intake Mode & Custom Foods Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLabelModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200 transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-sky-600" />
            <span>+ Ingreso por Etiqueta Nutricional</span>
          </button>

          <button
            onClick={onOpenCustomFoodModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-amber-700" />
            <span>+ Crear Alimento Propio</span>
          </button>
        </div>
      </div>

      {/* Peruvian Food Bank Browser */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
        <div className="mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Banco de Comidas Peruanas y Supermercados
          </h3>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar Lomo saltado, Pechuga San Fernando, Gloria, quinua, camote..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCat === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-xs">
              No se encontraron alimentos en esta categoría. Puedes crearlo con el botón "+ Crear Alimento Propio" o "+ Ingreso por Etiqueta".
            </div>
          ) : (
            filteredFoods.map(food => (
              <div
                key={food.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-stone-50/60 border border-stone-100 hover:border-emerald-200 hover:bg-white transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {food.n}
                    </span>
                    {food.brand && (
                      <span className="text-[10px] bg-stone-200/70 text-stone-600 px-1.5 py-0.5 rounded">
                        {food.brand}
                      </span>
                    )}
                    {food.isCustom && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                        Personalizado
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="text-stone-400">({food.u})</span>
                    <span>·</span>
                    <strong className="text-rose-600">{food.kcal} kcal</strong>
                    <span>·</span>
                    <span className="text-sky-700 font-medium">P: {food.p}g</span>
                    <span>·</span>
                    <span className="text-amber-700 font-medium">C: {food.c}g</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">G: {food.g}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Recipe Breakdown Button for composite dishes */}
                  {food.isComposite && (
                    <button
                      type="button"
                      onClick={() => onOpenBreakdown(food)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Ver y ajustar ingredientes por separado"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-700" />
                      <span>Desglosar receta</span>
                    </button>
                  )}

                  {/* Direct Add Standard Button */}
                  <button
                    type="button"
                    onClick={() => onAddToPlate(food)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Macro Progress Bar
function MacroBar({
  label,
  current,
  target,
  unit,
  color,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: 'rose' | 'sky' | 'amber' | 'emerald';
}) {
  const pct = Math.min(Math.round((current / (target || 1)) * 100), 125);
  const isOver = pct > 105;
  const isNear = pct >= 85 && pct <= 105;

  const colorStyles = {
    rose: {
      bar: isOver ? 'bg-rose-600' : isNear ? 'bg-emerald-600' : 'bg-rose-500',
      text: 'text-rose-700',
    },
    sky: {
      bar: isOver ? 'bg-sky-600' : isNear ? 'bg-emerald-600' : 'bg-sky-500',
      text: 'text-sky-700',
    },
    amber: {
      bar: isOver ? 'bg-rose-500' : isNear ? 'bg-emerald-600' : 'bg-amber-500',
      text: 'text-amber-700',
    },
    emerald: {
      bar: isOver ? 'bg-rose-500' : isNear ? 'bg-emerald-600' : 'bg-emerald-500',
      text: 'text-emerald-700',
    },
  };

  return (
    <div className="bg-stone-50/80 rounded-2xl p-2.5 sm:p-3 border border-stone-100">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className="font-mono text-stone-500 text-[11px]">
          <strong className={colorStyles[color].text}>{current}</strong> / {target} {unit}
          <span className="ml-1 text-[10px] text-stone-400">({pct}%)</span>
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorStyles[color].bar}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
