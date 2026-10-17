import React, { useState } from 'react';
import { calculateLabelMacros } from '../utils/calculator';
import { FoodItem } from '../types/nutrition';
import { X, Tag, BookmarkPlus, Plus, Sparkles, Scale, Info } from 'lucide-react';

interface NutritionLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (foodItem: FoodItem, consumedGrams: number) => void;
  onSaveToLibrary: (foodItem: FoodItem) => void;
}

export const NutritionLabelModal: React.FC<NutritionLabelModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
  onSaveToLibrary,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [basis, setBasis] = useState<'100g' | 'serving'>('100g');
  const [servingGrams, setServingGrams] = useState<number>(30);
  const [kcal, setKcal] = useState<number>(0);
  const [prot, setProt] = useState<number>(0);
  const [carb, setCarb] = useState<number>(0);
  const [gras, setGras] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);
  const [consumedGrams, setConsumedGrams] = useState<number>(100);
  const [saveToLibrary, setSaveToLibrary] = useState(true);

  if (!isOpen) return null;

  const currentResult = calculateLabelMacros(
    basis,
    servingGrams,
    kcal,
    prot,
    carb,
    gras,
    consumedGrams
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Standardized food item
    const newFood: FoodItem = {
      id: `custom_label_${Date.now()}`,
      n: brand.trim() ? `${name.trim()} (${brand.trim()})` : name.trim(),
      cat: 'Etiquetas',
      brand: brand.trim() || 'Etiqueta nutricional',
      kcal: currentResult.kcal,
      p: currentResult.p,
      c: currentResult.c,
      g: currentResult.g,
      u: `${consumedGrams}g`,
      isCustom: true,
    };

    if (saveToLibrary) {
      // Also calculate base 100g representation for the library
      const base100gRatio = basis === '100g' ? 1 : 100 / (servingGrams || 100);
      const libraryItem: FoodItem = {
        id: `lib_${Date.now()}`,
        n: brand.trim() ? `${name.trim()} (${brand.trim()})` : name.trim(),
        cat: 'Personalizados',
        brand: brand.trim() || 'Mi despensa',
        kcal: Math.round(kcal * base100gRatio),
        p: +(prot * base100gRatio).toFixed(1),
        c: +(carb * base100gRatio).toFixed(1),
        g: +(gras * base100gRatio).toFixed(1),
        u: '100g',
        isCustom: true,
      };
      onSaveToLibrary(libraryItem);
    }

    onAddFood(newFood, consumedGrams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                Ingreso por Etiqueta Nutricional
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Copia los datos de la parte trasera del empaque (Plaza Vea, Metro, etc.)
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Alimento / Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Yogur Griego Natural"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Marca / Supermercado
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Ej: Danlac / Metro / Gloria"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
          </div>

          {/* Basis Toggle */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                Los valores de la etiqueta están indicados:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBasis('100g')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  basis === '100g'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                Por cada 100g / 100ml
              </button>

              <button
                type="button"
                onClick={() => setBasis('serving')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  basis === 'serving'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                Por porción declarada
              </button>
            </div>

            {basis === 'serving' && (
              <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-xs text-stone-600">Tamaño de porción en gramos/ml:</span>
                <input
                  type="number"
                  min="1"
                  value={servingGrams}
                  onChange={e => setServingGrams(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-20 px-2 py-1 text-center text-xs font-bold font-mono border border-stone-200 rounded-lg bg-white"
                />
              </div>
            )}
          </div>

          {/* Label Nutritional Values */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Valores leídos en la etiqueta (según {basis === '100g' ? '100g' : `${servingGrams}g`})
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-rose-600 block mb-1">KCAL</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={kcal || ''}
                  onChange={e => setKcal(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full text-center font-mono font-bold text-sm bg-white border border-stone-200 rounded-lg py-1 focus:outline-emerald-600"
                />
              </div>

              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-sky-600 block mb-1">PROTEÍNA (g)</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={prot || ''}
                  onChange={e => setProt(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full text-center font-mono font-bold text-sm bg-white border border-stone-200 rounded-lg py-1 focus:outline-emerald-600"
                />
              </div>

              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">CARBOS (g)</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={carb || ''}
                  onChange={e => setCarb(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full text-center font-mono font-bold text-sm bg-white border border-stone-200 rounded-lg py-1 focus:outline-emerald-600"
                />
              </div>

              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">GRASAS (g)</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={gras || ''}
                  onChange={e => setGras(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full text-center font-mono font-bold text-sm bg-white border border-stone-200 rounded-lg py-1 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Amount Consumed */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700" />
                ¿Cuántos gramos o ml consumiste hoy?
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={consumedGrams}
                  onChange={e => setConsumedGrams(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-20 px-2 py-1 text-center font-mono font-bold text-sm bg-white border border-emerald-300 rounded-lg text-emerald-950"
                />
                <span className="text-xs font-bold text-emerald-800">g / ml</span>
              </div>
            </div>

            {/* Calculated Result Banner */}
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60 flex items-center justify-around text-center">
              <div>
                <div className="text-base font-bold text-rose-600">{currentResult.kcal}</div>
                <div className="text-[10px] text-stone-500">kcal finales</div>
              </div>
              <div className="h-6 w-px bg-stone-200"></div>
              <div>
                <div className="text-base font-bold text-sky-600">{currentResult.p}g</div>
                <div className="text-[10px] text-stone-500">Proteínas</div>
              </div>
              <div className="h-6 w-px bg-stone-200"></div>
              <div>
                <div className="text-base font-bold text-amber-600">{currentResult.c}g</div>
                <div className="text-[10px] text-stone-500">Carbos</div>
              </div>
              <div className="h-6 w-px bg-stone-200"></div>
              <div>
                <div className="text-base font-bold text-emerald-600">{currentResult.g}g</div>
                <div className="text-[10px] text-stone-500">Grasas</div>
              </div>
            </div>
          </div>

          {/* Option to persist to memory */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="saveToLib"
              checked={saveToLibrary}
              onChange={e => setSaveToLibrary(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
            <label htmlFor="saveToLib" className="text-xs text-stone-600 cursor-pointer select-none">
              Guardar en mi <strong>despensa permanente</strong> (Memoria de usuario)
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar a mi plato ({currentResult.kcal} kcal)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
