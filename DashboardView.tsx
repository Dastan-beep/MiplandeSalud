import React from 'react';
import { UserProfile } from '../types/nutrition';
import { calculateIMC, getImcClassification } from '../utils/calculator';
import {
  Flame,
  Droplets,
  Dumbbell,
  TrendingDown,
  Sparkles,
  Info,
  Calendar,
  Apple,
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  calorieDelta: number;
  tdee: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  calorieDelta,
  tdee,
}) => {
  const { nombre, peso, meta, talla, goal, macros, ls } = userProfile;
  const imcCurrent = calculateIMC(peso, talla);
  const imcMeta = calculateIMC(meta, talla);
  const imcClassCurrent = getImcClassification(imcCurrent);
  const imcClassMeta = getImcClassification(imcMeta);

  const waterLiters = (peso * 0.035).toFixed(1);
  const diff = Math.abs(peso - meta);
  const estimatedMonths = Math.max(1, Math.ceil(diff / 2.2));

  // Generate projection points for SVG chart
  const projectionPoints = [];
  const now = new Date();
  for (let i = 0; i <= estimatedMonths; i++) {
    const projectedWeight = +(peso + ((meta - peso) * (i / estimatedMonths))).toFixed(1);
    const d = new Date(now);
    d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString('es-PE', { month: 'short' });
    projectionPoints.push({ month: label, weight: projectedWeight });
  }

  const minChart = Math.min(peso, meta) - 2;
  const maxChart = Math.max(peso, meta) + 2;

  // Macro percentages
  const protKcal = macros.prot * 4;
  const fatKcal = macros.gras * 9;
  const carbKcal = macros.carb * 4;
  const totalKcal = macros.kcal || 1;

  const protPct = Math.round((protKcal / totalKcal) * 100);
  const fatPct = Math.round((fatKcal / totalKcal) * 100);
  const carbPct = Math.max(0, 100 - protPct - fatPct);

  return (
    <div className="space-y-4">
      {/* Intro Welcome Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            Visión General
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            ¡Hola, {nombre}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            {goal === 'perdida'
              ? `Tu plan está calibrado para perder grasa de forma sostenible a un ritmo saludable de ~2 a 2.5 kg al mes, manteniendo tu masa muscular con 1.9g de proteína por kg.`
              : `Tu plan está diseñado para optimizar la hipertrofia muscular y recuperación deportiva, combinando fuentes de proteína de alta biodisponibilidad y carbohidratos andinos.`}
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 flex items-center gap-3 sm:self-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Gasto total (TDEE)</div>
            <div className="text-sm font-bold text-stone-800">{tdee} kcal/día</div>
            <div className="text-[11px] font-semibold text-emerald-700">
              {calorieDelta < 0 ? `Déficit ${calorieDelta} kcal` : `Superávit +${calorieDelta} kcal`}
            </div>
          </div>
        </div>
      </div>

      {/* IMC & Health Metrics 2-column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Estado Actual
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {peso} <span className="text-base font-normal text-stone-500">kg</span>
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 ${imcClassCurrent.color}`}>
              IMC {imcCurrent} · {imcClassCurrent.label}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Talla: {talla} cm · Nivel de actividad: <strong className="capitalize">{ls}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Objetivo Final
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
              {meta} <span className="text-base font-normal text-stone-500">kg</span>
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 ${imcClassMeta.color}`}>
              IMC Meta {imcMeta} · {imcClassMeta.label}
            </span>
          </div>
          <p className="text-xs text-stone-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            Tiempo estimado: ~{estimatedMonths} {estimatedMonths === 1 ? 'mes' : 'meses'} a ritmo seguro
          </p>
        </div>
      </div>

      {/* SVG Projection Curve */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Curva de Proyección de Peso
            </h3>
            <p className="text-xs text-stone-500">
              {peso > meta ? 'Trayectoria estimada de pérdida gradual' : 'Trayectoria estimada de recomposición/ganancia'}
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
            Meta: {meta} kg
          </span>
        </div>

        {/* Responsive SVG Chart */}
        <div className="h-44 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130">
            <defs>
              <linearGradient id="gradientPeso" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Target line */}
            <line
              x1="20"
              y1={110 - ((meta - minChart) / (maxChart - minChart)) * 90}
              x2="480"
              y2={110 - ((meta - minChart) / (maxChart - minChart)) * 90}
              stroke="#0F6E56"
              strokeDasharray="4,4"
              strokeWidth="1.5"
            />

            {/* Projection Area & Curve */}
            {projectionPoints.length > 1 && (
              <>
                {/* Area under curve */}
                <path
                  d={`
                    M 20 ${110 - ((projectionPoints[0].weight - minChart) / (maxChart - minChart)) * 90}
                    ${projectionPoints
                      .map((p, idx) => {
                        const x = 20 + (idx / (projectionPoints.length - 1)) * 460;
                        const y = 110 - ((p.weight - minChart) / (maxChart - minChart)) * 90;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}
                    L 480 120 L 20 120 Z
                  `}
                  fill="url(#gradientPeso)"
                />

                {/* Stroke line */}
                <path
                  d={`
                    M 20 ${110 - ((projectionPoints[0].weight - minChart) / (maxChart - minChart)) * 90}
                    ${projectionPoints
                      .map((p, idx) => {
                        const x = 20 + (idx / (projectionPoints.length - 1)) * 460;
                        const y = 110 - ((p.weight - minChart) / (maxChart - minChart)) * 90;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}
                  `}
                  fill="none"
                  stroke="#1D9E75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Point nodes */}
                {projectionPoints.map((p, idx) => {
                  const x = 20 + (idx / (projectionPoints.length - 1)) * 460;
                  const y = 110 - ((p.weight - minChart) / (maxChart - minChart)) * 90;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#0F6E56" strokeWidth="2.5" />
                      <text x={x} y={125} textAnchor="middle" fontSize="10" fill="#78716c" fontFamily="sans-serif">
                        {p.month}
                      </text>
                      <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1c1917" fontFamily="sans-serif">
                        {p.weight}kg
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Daily Recommended Macronutrient Distribution */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Distribución de Macronutrientes Diarios Recomendados
        </h3>

        <div className="space-y-3">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-sky-800">Proteínas · {macros.prot}g al día</span>
              <span className="text-sky-700 font-mono">{protPct}% de tus calorías</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${protPct}%` }}></div>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Pollo San Fernando, pescado bonito, atún en agua, huevos frescos, yogur griego, queso fresco Laive.
            </p>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-800">Carbohidratos complejos · {macros.carb}g al día</span>
              <span className="text-amber-700 font-mono">{carbPct}% de tus calorías</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbPct}%` }}></div>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Camote amarillo/morado, arroz blanco o integral Costeño, quinua perlada, avena Quaker, lentejas y frejoles.
            </p>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-800">Grasas saludables · {macros.gras}g al día</span>
              <span className="text-emerald-700 font-mono">{fatPct}% de tus calorías</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${fatPct}%` }}></div>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Palta fuerte o Hass peruana, aceite de oliva virgen El Olivar, frutos secos (maní, almendras sin sal).
            </p>
          </div>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs sm:text-sm text-emerald-900 leading-relaxed flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Consejo peruano para tu meta de {goal === 'ganancia' ? 'Ganancia Muscular' : 'Pérdida de Grasa'}:</strong>{' '}
          {goal === 'ganancia'
            ? 'No descuides la proteína post-entrenamiento. En Perú tienes opciones económicas de altísimo valor biológico como el filete de bonito fresco (rico en Omega 3) o la sangrecita con yuca.'
            : 'El plato criollo suele ser alto en aceite en el aderezo. Pedir lomo saltado con papas al air fryer y ensalada fresca sin mayonesa reduce 300 kcal sin perder un ápice de sabor.'}
        </div>
      </div>
    </div>
  );
};
