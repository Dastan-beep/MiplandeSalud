import React, { useState, useEffect } from 'react';
import { FitnessGoal, LifestyleLevel, UserProfile } from '../types/nutrition';
import { computeGoalMacros } from '../utils/calculator';
import { X, User, Flame, Dumbbell, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [nombre, setNombre] = useState('Vanessa');
  const [edad, setEdad] = useState<number>(30);
  const [peso, setPeso] = useState<number>(68);
  const [talla, setTalla] = useState<number>(163);
  const [meta, setMeta] = useState<number>(60);
  const [goal, setGoal] = useState<FitnessGoal>('perdida');
  const [ls, setLs] = useState<LifestyleLevel>('moderado');

  useEffect(() => {
    if (currentProfile) {
      setNombre(currentProfile.nombre || 'Vanessa');
      setEdad(currentProfile.edad || 30);
      setPeso(currentProfile.peso || 68);
      setTalla(currentProfile.talla || 163);
      setMeta(currentProfile.meta || 60);
      setGoal(currentProfile.goal || 'perdida');
      setLs(currentProfile.ls || 'moderado');
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const lifestyles: Array<{
    id: LifestyleLevel;
    ico: string;
    name: string;
    desc: string;
  }> = [
    { id: 'sedentario', ico: '🛋️', name: 'Sedentario', desc: 'Oficina, poco movimiento' },
    { id: 'ligero', ico: '🚶', name: 'Ligero', desc: 'Caminatas, 1–2 días ej.' },
    { id: 'moderado', ico: '🏃', name: 'Moderado', desc: '3–4 días de ejercicio' },
    { id: 'activo', ico: '💪', name: 'Activo', desc: '5–6 días de gym / deporte' },
    { id: 'deportista', ico: '🏋️', name: 'Deportista', desc: 'Entrenamiento diario intenso' },
    { id: 'embarazo', ico: '🤱', name: 'Embarazo', desc: 'Gestación / Lactancia' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { macros } = computeGoalMacros(peso, talla, edad, ls, goal);

    const updatedProfile: UserProfile = {
      nombre: nombre.trim() || 'Tú',
      edad,
      peso,
      talla,
      meta,
      goal,
      ls,
      macros,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                {currentProfile ? 'Editar mi Perfil' : 'Cuéntame sobre ti 👋'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Para calcular tus macros adaptados a la gastronomía peruana
              </p>
            </div>
          </div>
          {currentProfile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Selector Switch in Form */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Objetivo Principal Dinámico *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGoal('perdida')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'perdida'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Pérdida de Grasa</span>
              </button>

              <button
                type="button"
                onClick={() => setGoal('ganancia')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'ganancia'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>Ganancia Muscular</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Vanessa"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Edad
              </label>
              <input
                type="number"
                min="14"
                max="95"
                required
                value={edad}
                onChange={e => setEdad(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Peso actual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="250"
                required
                value={peso}
                onChange={e => setPeso(parseFloat(e.target.value) || 60)}
                className="w-full px-2.5 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Talla (cm)
              </label>
              <input
                type="number"
                min="130"
                max="220"
                required
                value={talla}
                onChange={e => setTalla(parseInt(e.target.value) || 160)}
                className="w-full px-2.5 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Peso meta (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="250"
                required
                value={meta}
                onChange={e => setMeta(parseFloat(e.target.value) || 55)}
                className="w-full px-2.5 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
              />
            </div>
          </div>

          {/* Lifestyle Grid */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Estilo de Vida y Actividad
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {lifestyles.map(item => (
                <div
                  key={item.id}
                  onClick={() => setLs(item.id)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    ls === item.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs'
                      : 'border-stone-200 hover:border-emerald-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  <div className="text-xl mb-1">{item.ico}</div>
                  <div className="text-xs font-bold">{item.name}</div>
                  <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Guardar y recalcular plan completo →</span>
          </button>
        </form>
      </div>
    </div>
  );
};
