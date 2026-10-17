import React, { useState } from 'react';
import { FoodItem, UserProfile } from '../types/nutrition';
import { Calendar, Plus, RefreshCw, X, ChevronRight, Check } from 'lucide-react';

interface WeeklyMenuProps {
  userProfile: UserProfile;
  foodBank: FoodItem[];
  weeklyPlan: Record<number, Record<string, FoodItem | null>>;
  onUpdateWeeklyMeal: (day: number, slotKey: string, food: FoodItem | null) => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const SLOTS = [
  { key: 'desayuno', label: 'Desayuno', time: '7:30 am' },
  { key: 'media_manana', label: 'Media Mañana', time: '10:30 am' },
  { key: 'almuerzo', label: 'Almuerzo Criollo', time: '1:00 pm' },
  { key: 'media_tarde', label: 'Media Tarde', time: '4:30 pm' },
  { key: 'cena', label: 'Cena Ligera', time: '7:45 pm' },
];

export const WeeklyMenu: React.FC<WeeklyMenuProps> = ({
  userProfile,
  foodBank,
  weeklyPlan,
  onUpdateWeeklyMeal,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    day: number;
    slotKey: string;
    slotLabel: string;
  }>({
    isOpen: false,
    day: 0,
    slotKey: '',
    slotLabel: '',
  });

  const [pickerSearch, setPickerSearch] = useState('');

  const currentDayMeals = weeklyPlan[selectedDay] || {};
  const dayKcal = Object.values(currentDayMeals).reduce(
    (sum, item) => sum + (item?.kcal || 0),
    0
  );
  const targetKcal = userProfile.macros.kcal;
  const pct = Math.min(Math.round((dayKcal / (targetKcal || 1)) * 100), 120);

  const filteredPickerFoods = foodBank.filter(f =>
    f.n.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Menú Semanal Peruano
            </h2>
            <p className="text-xs text-stone-500">
              Organiza lo que comes cada día para cumplir tus calorías sin improvisar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {dayKcal} / {targetKcal} kcal ({pct}%)
            </span>
          </div>
        </div>

        {/* Day of Week Selector */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {DAYS.map((d, idx) => (
            <button
              key={d}
              onClick={() => setSelectedDay(idx)}
              className={`flex-1 min-w-[70px] py-2 px-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-center ${
                selectedDay === idx
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {SLOTS.map(slot => {
          const meal = currentDayMeals[slot.key];

          return (
            <div
              key={slot.key}
              className={`rounded-3xl p-4 transition-all ${
                meal
                  ? 'bg-white border border-stone-200/90 shadow-xs'
                  : 'bg-stone-50/70 border-2 border-dashed border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {slot.label} · <span className="font-normal">{slot.time}</span>
                </span>
                {meal && (
                  <span className="text-xs font-bold text-rose-600">
                    {meal.kcal} kcal
                  </span>
                )}
              </div>

              {meal ? (
                <div className="flex items-center justify-between gap-3 mt-1">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{meal.n}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      P: {meal.p}g · C: {meal.c}g · G: {meal.g}g ({meal.u})
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setPickerModal({
                          isOpen: true,
                          day: selectedDay,
                          slotKey: slot.key,
                          slotLabel: slot.label,
                        })
                      }
                      className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Cambiar
                    </button>
                    <button
                      onClick={() => onUpdateWeeklyMeal(selectedDay, slot.key, null)}
                      className="text-xs font-semibold text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                      title="Quitar comida"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-stone-400 italic">Sin comida asignada</span>
                  <button
                    onClick={() =>
                      setPickerModal({
                        isOpen: true,
                        day: selectedDay,
                        slotKey: slot.key,
                        slotLabel: slot.label,
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Elegir comida</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Meal Picker Modal */}
      {pickerModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {pickerModal.slotLabel} ({DAYS[pickerModal.day]})
                </h3>
                <p className="text-xs text-stone-500">Selecciona el alimento o plato para este tiempo</p>
              </div>
              <button
                onClick={() => setPickerModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={pickerSearch}
              onChange={e => setPickerSearch(e.target.value)}
              placeholder="Buscar comida peruana..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50 mb-3 focus:bg-white focus:outline-emerald-600"
            />

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredPickerFoods.map(food => (
                <div
                  key={food.id}
                  onClick={() => {
                    onUpdateWeeklyMeal(pickerModal.day, pickerModal.slotKey, food);
                    setPickerModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 border border-stone-100 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {food.n}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {food.kcal} kcal · P:{food.p}g · C:{food.c}g · G:{food.g}g ({food.u})
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
