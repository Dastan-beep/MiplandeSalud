import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 transition-all cursor-pointer shadow-xs animate-pulse"
      >
        <Download className="w-3.5 h-3.5 text-emerald-200" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
          <span>Instalar en iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Instalar en tu iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-stone-600 space-y-2.5 my-3">
                <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    1
                  </span>
                  <span>Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba) en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    2
                  </span>
                  <span>Desliza hacia abajo y presiona <strong>"Agregar a la pantalla de inicio"</strong>.</span>
                </div>
                <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    3
                  </span>
                  <span>Presiona <strong>"Agregar"</strong> arriba a la derecha. ¡Listo! Se abrirá como una aplicación nativa.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
