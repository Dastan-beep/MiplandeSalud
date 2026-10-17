import React from 'react';
import { FitnessGoal } from '../types/nutrition';
import { Flame, Dumbbell, Sparkles } from 'lucide-react';

interface GoalSwitcherProps {
  currentGoal: FitnessGoal;
  onGoalChange: (newGoal: FitnessGoal) => void;
  calorieDelta: number;
  totalKcal: number;
}

export const GoalSwitcher: React.FC<GoalSwitcherProps> = ({
  currentGoal,
  onGoalChange,
  calorieDelta,
  totalKcal,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Objetivo Nutricional Dinámico
            </h3>
            <p className="text-sm font-semibold text-stone-800">
              {currentGoal === 'perdida'
                ? 'Déficit Calórico Inteligente'
                : 'Superávit Limpio & Hipertrofia'}
            </p>
          </div>
        </div>

        {/* Dynamic Switch Buttons */}
        <div className="inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onGoalChange('perdida')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentGoal === 'perdida'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Pérdida de grasa</span>
          </button>

          <button
            type="button"
            onClick={() => onGoalChange('ganancia')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentGoal === 'ganancia'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Ganancia muscular</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-stone-500 bg-stone-50/80 rounded-xl p-2.5 border border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <span>
          {currentGoal === 'perdida' ? (
            <>
              🎯 <strong>Estrategia de corte:</strong> Déficit de{' '}
              <strong className="text-rose-600">{Math.abs(calorieDelta)} kcal</strong> para quemar grasa preservando tu masa magra con proteína alta (~1.8–2.2g/kg).
            </>
          ) : (
            <>
              🎯 <strong>Estrategia de masa:</strong> Superávit moderado de{' '}
              <strong className="text-emerald-700">+{calorieDelta} kcal</strong> para síntesis proteica óptima sin ganar grasa innecesaria.
            </>
          )}
        </span>
        <span className="font-mono font-medium text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
          Objetivo hoy: {totalKcal} kcal
        </span>
      </div>
    </div>
  );
};
