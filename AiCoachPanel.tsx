import React, { useState } from 'react';
import { PlateItem, UserProfile } from '../types/nutrition';
import {
  Sparkles,
  Send,
  ChefHat,
  Bot,
  User,
  Zap,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Scale,
  ShoppingCart,
  Flame,
} from 'lucide-react';

interface AiCoachPanelProps {
  userProfile: UserProfile | null;
  plateItems: PlateItem[];
  plateTotals: { kcal: number; prot: number; carb: number; gras: number };
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  badge?: string;
}

export const AiCoachPanel: React.FC<AiCoachPanelProps> = ({
  userProfile,
  plateItems,
  plateTotals,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `¡Hola ${userProfile?.nombre || ''}! 👋 Soy **NutriCoach Perú**, tu asesor de nutrición y fitness con inteligencia artificial.

Puedo ayudarte a:
• **Analizar tu plato** y ver si cumple tus macros según tu objetivo de **${userProfile?.goal === 'ganancia' ? 'Ganancia Muscular' : 'Pérdida de Grasa'}**.
• Darte **versiones "Fit"** de comidas peruanas (Lomo saltado, Ají de gallina, Seco con frejoles, Causa, etc.).
• Guiarte en tus compras de supermercado (Metro, Plaza Vea, Tottus, mercados locales).

¿Qué te gustaría consultar hoy?`,
      timestamp: 'Ahora',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          userProfile,
          currentLog: {
            items: plateItems,
            totals: plateTotals,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'No pude obtener una respuesta en este momento.';

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        badge: data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'NutriCoach Perú',
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: 'Ocurrió un error al consultar con el asistente. Por favor intenta de nuevo en unos segundos.',
        timestamp: 'Ahora',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCurrentPlate = async () => {
    if (plateItems.length === 0) {
      const emptyMsg: Message = {
        id: `empty_${Date.now()}`,
        sender: 'ai',
        text: '🍽️ Tu plato actual aún está vacío. Agrega algunos alimentos desde el banco de comidas o con la etiqueta nutricional y luego haz clic en "Evaluar mi plato actual".',
        timestamp: 'Ahora',
      };
      setMessages(prev => [...prev, emptyMsg]);
      return;
    }

    const promptText = `Por favor analiza nutricionalmente los alimentos de mi plato actual: tengo acumuladas ${plateTotals.kcal} kcal, ${plateTotals.prot}g de proteína, ${plateTotals.carb}g de carbohidratos y ${plateTotals.gras}g de grasas en ${plateItems.length} alimentos registrados. Mi objetivo es ${userProfile?.goal === 'ganancia' ? 'Ganancia Muscular' : 'Pérdida de Grasa'}. ¿Qué ajustes me recomiendas?`;
    await sendMessage(promptText);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col h-[680px]">
      {/* Panel Top Header */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-emerald-300 font-bold border border-white/10">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                NutriCoach IA Perú
              </h2>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-emerald-100/75 mt-0.5">
              Consejos adaptados a mercados y supermercados peruanos
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome_reset',
                sender: 'ai',
                text: 'Conversación reiniciada. ¿En qué te ayudo con tu plan de nutrición peruano?',
                timestamp: 'Ahora',
              },
            ])
          }
          title="Reiniciar chat"
          className="text-emerald-200/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Suggestions Bar */}
      <div className="bg-stone-50 border-b border-stone-100 p-2 sm:p-3 overflow-x-auto scrollbar-none flex gap-2">
        <button
          onClick={handleAnalyzeCurrentPlate}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold border border-emerald-300/60 transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-700" />
          <span>⚡ Evaluar mi plato actual</span>
        </button>

        <button
          onClick={() => sendMessage('¿Cómo preparar un Lomo Saltado Fit bajo en calorías y alto en proteína?')}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
        >
          <ChefHat className="w-3.5 h-3.5 text-amber-600" />
          <span>Lomo Saltado Fit</span>
        </button>

        <button
          onClick={() => sendMessage('¿Cuáles son las fuentes de proteína más económicas en Plaza Vea o Metro?')}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-sky-600" />
          <span>Proteínas baratas en súper</span>
        </button>

        <button
          onClick={() => sendMessage('¿Qué es mejor para mi meta: arroz blanco, camote o quinua?')}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5 text-rose-600" />
          <span>Arroz vs Camote vs Quinua</span>
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/40">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`rounded-2xl px-3.5 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-xs'
              }`}
            >
              {msg.badge && (
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {msg.badge}
                </div>
              )}

              <div className="whitespace-pre-wrap space-y-1 font-sans">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('•') || line.startsWith('-')) {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{formatInlineMarkdown(line.replace(/^[•-]\s*/, ''))}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className={line.trim() === '' ? 'h-2' : ''}>
                      {formatInlineMarkdown(line)}
                    </p>
                  );
                })}
              </div>

              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-emerald-100/70' : 'text-stone-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5 max-w-xl">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-stone-700 border border-stone-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-stone-500 font-medium pl-1">
                NutriCoach está formulando su respuesta...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 bg-white border-t border-stone-200/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pregunta a NutriCoach sobre comidas, macros o compras peruanas..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-2xl bg-stone-50/70 focus:bg-white focus:outline-emerald-600 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
};

function formatInlineMarkdown(text: string): React.ReactNode {
  // Simple bold formatter for **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
