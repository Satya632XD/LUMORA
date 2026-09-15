import React from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { Lightbulb, Check, X } from 'lucide-react';

export const HintModal: React.FC = () => {
  const { activeHint } = useGameStore();

  if (!activeHint) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 sm:bottom-28 max-w-md mx-auto z-40 animate-pop-number">
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-amber-400/40 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {activeHint.technique}
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {activeHint.summary}
              </h4>
            </div>
          </div>
          <button
            onClick={() => gameStore.clearHint()}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            aria-label="Dismiss Hint"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {activeHint.explanation}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => gameStore.applyHint()}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Place Number ({activeHint.value})</span>
          </button>
          <button
            onClick={() => gameStore.clearHint()}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-all active:scale-95"
          >
            I'll do it
          </button>
        </div>
      </div>
    </div>
  );
};
