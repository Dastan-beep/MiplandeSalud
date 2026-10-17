import React, { useState } from 'react';
import { LifestyleLevel } from '../types/nutrition';
import { Dumbbell, ExternalLink, Flame, PlayCircle, Trophy } from 'lucide-react';

interface ExerciseRoutineProps {
  currentLevel: LifestyleLevel;
}

interface Exercise {
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

const EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Caminata rápida enérgica 30 min',
    level: ['sedentario', 'ligero'],
    kcal: 120,
    sets: '30 min continuos',
    col: 'bg-emerald-100 text-emerald-800',
    ico: '🚶',
    desc: 'Ritmo ligero y constante. Ideal para activar el metabolismo sin estrés articular.',
    ytq: 'caminata suave ejercicio principiantes en casa',
  },
  {
    id: 'ex-2',
    name: 'Sentadillas al aire sin peso',
    level: ['sedentario', 'ligero', 'moderado'],
    kcal: 90,
    sets: '3 series × 12 reps',
    col: 'bg-sky-100 text-sky-800',
    ico: '🦵',
    desc: 'Pies al ancho de hombros, desciende hasta 90 grados manteniendo el pecho erguido.',
    ytq: 'como hacer sentadillas correctamente principiantes',
  },
  {
    id: 'ex-3',
    name: 'Estiramientos y movilidad matutina',
    level: ['sedentario', 'ligero', 'embarazo'],
    kcal: 45,
    sets: '15 min',
    col: 'bg-purple-100 text-purple-800',
    ico: '🧘',
    desc: 'Movilidad articular de cadera, columna torácica, isquiotibiales y hombros.',
    ytq: 'rutina de estiramientos matutinos flexibilidad',
  },
  {
    id: 'ex-4',
    name: 'Plancha abdominal isométrica',
    level: ['ligero', 'moderado', 'activo', 'deportista'],
    kcal: 60,
    sets: '3 series × 35-50 seg',
    col: 'bg-amber-100 text-amber-800',
    ico: '🔥',
    desc: 'Activa glúteos y abdomen como si fueras a recibir un golpe. Cuello neutro.',
    ytq: 'plancha abdominal tecnica correcta',
  },
  {
    id: 'ex-5',
    name: 'Sentadillas búlgaras unilaterales',
    level: ['moderado', 'activo', 'deportista'],
    kcal: 160,
    sets: '4 series × 10 reps por pierna',
    col: 'bg-rose-100 text-rose-800',
    ico: '🏋️',
    desc: 'Pie trasero apoyado en un banco o silla. Enfoque potente en cuádriceps y glúteo.',
    ytq: 'sentadilla bulgara tecnica paso a paso',
  },
  {
    id: 'ex-6',
    name: 'HIIT Tabata quema-grasa 20 min',
    level: ['moderado', 'activo'],
    kcal: 220,
    sets: '20 min (20s activo / 10s descanso)',
    col: 'bg-rose-100 text-rose-800',
    ico: '⚡',
    desc: 'Intervalos intensos con burpees, jumping jacks, escaladores y saltos.',
    ytq: 'hiit 20 minutos quema grasa casa español',
  },
  {
    id: 'ex-7',
    name: 'Peso muerto rumano con mancuernas',
    level: ['activo', 'deportista'],
    kcal: 170,
    sets: '4 series × 12 reps',
    col: 'bg-sky-100 text-sky-800',
    ico: '🏋️',
    desc: 'Bisagra de cadera empujando los glúteos hacia atrás. Espalda recta y neutra.',
    ytq: 'peso muerto rumano con mancuernas tecnica',
  },
  {
    id: 'ex-8',
    name: 'Cardio en bicicleta estática (Zona 2)',
    level: ['moderado', 'activo', 'deportista'],
    kcal: 320,
    sets: '40 min continuos',
    col: 'bg-emerald-100 text-emerald-800',
    ico: '🚴',
    desc: 'Frecuencia cardíaca en zona 2 (60-70% FC máx). Deberías poder hablar con frases cortas.',
    ytq: 'entrenamiento zona 2 bicicleta beneficios',
  },
  {
    id: 'ex-9',
    name: 'Yoga y pilates para suelo pélvico',
    level: ['embarazo', 'ligero'],
    kcal: 80,
    sets: '25 min',
    col: 'bg-purple-100 text-purple-800',
    ico: '🤱',
    desc: 'Movimientos suaves para aliviar dolor lumbar y preparar articulaciones.',
    ytq: 'yoga prenatal suave segundo trimestre',
  },
];

export const ExerciseRoutine: React.FC<ExerciseRoutineProps> = ({ currentLevel }) => {
  const [filterLevel, setFilterLevel] = useState<string>(currentLevel);

  const levels: Array<{ id: string; label: string }> = [
    { id: 'todos', label: 'Todos' },
    { id: 'sedentario', label: 'Sedentario' },
    { id: 'ligero', label: 'Ligero' },
    { id: 'moderado', label: 'Moderado' },
    { id: 'activo', label: 'Activo' },
    { id: 'deportista', label: 'Deportista' },
    { id: 'embarazo', label: 'Embarazo/Lactancia' },
  ];

  const filtered =
    filterLevel === 'todos'
      ? EXERCISES
      : EXERCISES.filter(e => e.level.includes(filterLevel as LifestyleLevel));

  return (
    <div className="space-y-4">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
          Rutinas de Ejercicio Adaptadas
        </h2>
        <p className="text-xs text-stone-500 mb-3">
          Entrenamientos funcionales y de fuerza con videos de técnica en español
        </p>

        {/* Level Filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setFilterLevel(l.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterLevel === l.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between gap-3 hover:border-emerald-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg ${ex.col}`}>
                    {ex.ico}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 leading-tight">{ex.name}</h3>
                    <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">{ex.sets}</span>
                      <span>·</span>
                      <span className="text-rose-600 font-semibold">~{ex.kcal} kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {ex.desc}
              </p>
            </div>

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.ytq)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors self-start cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ver tutorial de técnica en YouTube →</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
