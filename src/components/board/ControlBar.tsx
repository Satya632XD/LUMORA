import React from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';
import {
  Undo2,
  Redo2,
  Eraser,
  Pencil,
  Lightbulb,
  Wand2,
} from 'lucide-react';

export const ControlBar: React.FC = () => {
  const { isPencilMode, history, redoStack, activeHint } = useGameStore();
  const [settings] = useSettings();

  const getActivePencilAccent = () => {
    switch (settings.theme) {
      case 'aurora':
        return 'bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]';
      case 'crystal':
        return 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(103,232,249,0.5)]';
      case 'midnight':
        return 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(129,140,248,0.5)]';
      case 'zen':
        return 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(134,239,172,0.5)]';
      case 'royal':
        return 'bg-amber-400 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.6)]';
    }
  };

  return (
    <div className="w-full max-w-[440px] sm:max-w-[480px] mx-auto flex items-center justify-between gap-1.5 px-2 py-1.5">
      {/* Undo */}
      <button
        type="button"
        aria-label="Undo move"
        disabled={history.length === 0}
        onClick={() => gameStore.undo()}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all active:scale-95"
      >
        <Undo2 className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">Undo</span>
      </button>

      {/* Redo */}
      <button
        type="button"
        aria-label="Redo move"
        disabled={redoStack.length === 0}
        onClick={() => gameStore.redo()}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all active:scale-95"
      >
        <Redo2 className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">Redo</span>
      </button>

      {/* Eraser */}
      <button
        type="button"
        aria-label="Erase cell value or notes"
        onClick={() => gameStore.eraseCell()}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all active:scale-95"
      >
        <Eraser className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">Erase</span>
      </button>

      {/* Pencil Notes Mode */}
      <button
        type="button"
        aria-label={`Toggle pencil notes, currently ${isPencilMode ? 'ON' : 'OFF'}`}
        onClick={() => gameStore.togglePencilMode()}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all active:scale-95 ${
          isPencilMode
            ? `${getActivePencilAccent()} border-transparent`
            : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
        }`}
      >
        <div className="relative">
          <Pencil className="w-5 h-5 mb-0.5" />
          <span
            className={`absolute -top-1 -right-2 w-2 h-2 rounded-full ${
              isPencilMode ? 'bg-white animate-ping' : 'bg-transparent'
            }`}
          />
        </div>
        <span className="text-[11px] font-medium">
          Notes {isPencilMode ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* Auto-Notes */}
      <button
        type="button"
        aria-label="Auto-fill candidate notes"
        onClick={() => gameStore.autoFillNotes()}
        className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all active:scale-95"
        title="Auto-fill candidate notes"
      >
        <Wand2 className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">Auto</span>
      </button>

      {/* Smart Hint */}
      <button
        type="button"
        aria-label="Request smart hint"
        onClick={() => gameStore.requestHint()}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all active:scale-95 ${
          activeHint
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse'
            : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
        }`}
      >
        <Lightbulb className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">Hint</span>
      </button>
    </div>
  );
};
