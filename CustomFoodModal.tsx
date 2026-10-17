import React, { useState } from 'react';
import { FoodItem } from '../types/nutrition';
import { X, BookmarkPlus, Plus, Sparkles, ChefHat } from 'lucide-react';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFood: (foodItem: FoodItem) => void;
}

export const CustomFoodModal: React.FC<CustomFoodModalProps> = ({
  isOpen,
  onClose,
  onSaveFood,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Platos peruanos' | 'Supermercado' | 'Desayuno' | 'Snacks' | 'Bebidas' | 'Personalizados'>('Personalizados');
  const [unit, setUnit] = useState('1 porción');
  const [kcal, setKcal] = useState<number>(0);
  const [prot, setProt] = useState<number>(0);
  const [carb, setCarb] = useState<number>(0);
  const [gras, setGras] = useState<number>(0);
  const [brand, setBrand] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      n: name.trim(),
      cat: category,
      brand: brand.trim() || 'Receta propia',
      kcal: Math.round(kcal),
      p: +prot.toFixed(1),
      c: +carb.toFixed(1),
      g: +gras.toFixed(1),
      u: unit.trim() || '1 porción',
      isCustom: true,
    };

    onSaveFood(newFood);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                Crear Alimento o Plato Casero
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Guárdalo en la memoria de la app para usarlo siempre
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
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nombre del Alimento o Plato *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Seco de pollo con quinua casero"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              >
                <option value="Personalizados">Personalizados</option>
                <option value="Platos peruanos">Platos peruanos</option>
                <option value="Supermercado">Supermercado</option>
                <option value="Desayuno">Desayuno</option>
                <option value="Snacks">Snacks</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Porción / Unidad
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="Ej: 1 plato, 100g, 1 taza"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Macronutrientes por porción
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-rose-600 block mb-1">KCAL *</span>
                <input
                  type="number"
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nota o Marca (Opcional)
            </label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="Ej: Receta de la abuela / Mercado San José"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Guardar Alimento en mi Memoria</span>
          </button>
        </form>
      </div>
    </div>
  );
};
