import React from 'react';
import { FitnessGoal, UserProfile } from '../types/nutrition';
import { GoalSwitcher } from './GoalSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { Sparkles, Edit3, HeartPulse, Droplets, Target, Flame, FolderDown } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile;
  onGoalChange: (goal: FitnessGoal) => void;
  calorieDelta: number;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onGoalChange,
  calorieDelta,
  onOpenProfile,
}) => {
  const { nombre, edad, peso, talla, meta, goal, macros } = userProfile;
  const diff = Math.abs(peso - meta);
  const estimatedMonths = Math.max(1, Math.ceil(diff / 2.2));
  const waterLiters = (peso * 0.035).toFixed(1);

  return (
    <header className="relative bg-gradient-to-br from-[#0F6E56] via-[#1D9E75] to-[#155e4b] text-white pt-6 pb-6 px-4 sm:px-6 shadow-md overflow-hidden">
      {/* Decorative backdrop shapes */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-400/10 pointer-events-none blur-lg"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top bar with tag & profile edit button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-emerald-100 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-200" />
            <span>Nutrición & Fitness Perú 2026</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="/nutrifit-peru.zip"
              download="nutrifit-peru.zip"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Descargar todo el código en un solo archivo ZIP"
            >
              <FolderDown className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Descargar</span> ZIP
            </a>
            <PWAInstallButton />
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar perfil</span>
            </button>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="mb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Plan Personalizado de {nombre}
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-0.5">
            {edad} años · {talla} cm · {peso} kg · Gastronomía Peruana & Supermercados
          </p>
        </div>

        {/* Dynamic Goal Switcher Bar */}
        <GoalSwitcher
          currentGoal={goal}
          onGoalChange={onGoalChange}
          calorieDelta={calorieDelta}
          totalKcal={macros.kcal}
        />

        {/* Header Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
            <div className="text-xs text-emerald-100/70 font-medium">Peso actual</div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">{peso} kg</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
            <div className="text-xs text-emerald-100/70 font-medium">Peso meta</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-200 mt-0.5">{meta} kg</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
            <div className="text-xs text-emerald-100/70 font-medium">Meta calórica</div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {macros.kcal.toLocaleString()} <span className="text-xs font-normal">kcal</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
            <div className="text-xs text-emerald-100/70 font-medium">Agua mínima</div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {waterLiters} <span className="text-xs font-normal">L/día</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
