import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/nutrition';
import { Check, Moon, Sun, Sparkles, Droplets, ShieldCheck, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HabitsAndSleepProps {
  userProfile: UserProfile;
}

export const HabitsAndSleep: React.FC<HabitsAndSleepProps> = ({ userProfile }) => {
  const { peso, macros } = userProfile;
  const waterTarget = (peso * 0.035).toFixed(1);

  const defaultHabits = [
    { id: 'h1', t: 'Beber agua suficiente', s: `Meta: ${waterTarget} litros diarios repartidos en el día` },
    { id: 'h2', t: 'Cumplir el objetivo de calorías', s: `Mantenerse dentro de ~${macros.kcal} kcal` },
    { id: 'h3', t: 'Llegar a la meta de proteínas', s: `${macros.prot}g de proteína para preservar/construir músculo` },
    { id: 'h4', t: 'Dormir entre 7 y 8 horas continuas', s: 'Apagar pantallas y luces brillantes a las 10:00 pm' },
    { id: 'h5', t: 'Consumir 3 porciones de vegetales frescos', s: 'Ensalada criolla, brócoli, tomate, espinaca al vapor' },
    { id: 'h6', t: 'Evitar ultraprocesados azucarados', s: 'Reemplaza galletas por fruta fresca, chicha natural o frutos secos' },
    { id: 'h7', t: 'Pesarme en ayunas cada semana', s: 'Misma hora, al despertar, sin calzado' },
    { id: 'h8', t: 'Comer con atención plena', s: 'Sin pantallas ni celular mientras almuerzas o cenas' },
  ];

  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const saved = JSON.parse(localStorage.getItem('nutrifit_habits') || '{}');
      if (saved.date === today && saved.checks) {
        setChecks(saved.checks);
      } else {
        setChecks({});
      }
    } catch (e) {
      setChecks({});
    }
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checks, [id]: !checks[id] };
    setChecks(updated);

    const today = new Date().toDateString();
    localStorage.setItem(
      'nutrifit_habits',
      JSON.stringify({ date: today, checks: updated })
    );

    // If all completed, shoot confetti
    const completedCount = Object.values(updated).filter(Boolean).length;
    if (completedCount === defaultHabits.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const completedCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Daily Habits Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Metas y Hábitos Diarios
            </h2>
            <p className="text-xs text-stone-500">
              La constancia en los pequeños hábitos genera las mayores transformaciones físicas
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            {completedCount} / {defaultHabits.length} completados
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {defaultHabits.map(h => {
            const isDone = !!checks[h.id];
            return (
              <div
                key={h.id}
                onClick={() => toggleCheck(h.id)}
                className="py-3 flex items-start gap-3 cursor-pointer group select-none"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'border-2 border-stone-300 group-hover:border-emerald-600 bg-white'
                  }`}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div
                    className={`text-sm font-semibold transition-colors ${
                      isDone ? 'line-through text-stone-400' : 'text-stone-800'
                    }`}
                  >
                    {h.t}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{h.s}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep & Circadian Recovery Guide */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Ciencia del Sueño y Quema de Grasa
            </h3>
            <p className="text-xs text-stone-500">
              El descanso óptimo regula las hormonas del apetito (Grelina y Leptina)
            </p>
          </div>
        </div>

        {/* Nightly Timeline */}
        <div className="space-y-3 pl-2 border-l-2 border-emerald-200 ml-3 my-4">
          <div className="relative pl-4">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -left-[21px] top-1"></div>
            <div className="text-xs font-bold text-stone-800">8:00 pm · Última comida sólida</div>
            <div className="text-xs text-stone-500">Cena moderada en carbos y rica en proteína magra (pescado, pollo o claras).</div>
          </div>

          <div className="relative pl-4">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[21px] top-1"></div>
            <div className="text-xs font-bold text-stone-800">9:30 pm · Filtro de luz azul y pantallas</div>
            <div className="text-xs text-stone-500">La luz azul de pantallas suprime la melatonina en un 50%, postergando el sueño profundo.</div>
          </div>

          <div className="relative pl-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1"></div>
            <div className="text-xs font-bold text-stone-800">10:30 pm · A la cama (7-8 horas)</div>
            <div className="text-xs text-stone-500">Habitación oscura y fresca. La hormona de crecimiento (GH) tiene su mayor pico aquí.</div>
          </div>

          <div className="relative pl-4">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 absolute -left-[21px] top-1"></div>
            <div className="text-xs font-bold text-stone-800">6:30 am · Despertar con luz natural y agua</div>
            <div className="text-xs text-stone-500">500ml de agua al despertar + luz solar para sincronizar el cortisol matutino.</div>
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs text-stone-600 leading-relaxed">
          💡 <strong>Dato metabólico:</strong> Dormir menos de 6 horas eleva la grelina (hambre) un 28% al día siguiente, haciendo que sientas antojos irresistibles de carbohidratos refinados y frituras.
        </div>
      </div>
    </div>
  );
};
