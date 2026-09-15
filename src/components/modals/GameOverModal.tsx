import React from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { HeartCrack, RotateCcw, ArrowLeft, PlusCircle } from 'lucide-react';

interface GameOverModalProps {
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ onBackToMenu }) => {
  const { isGameOver, mistakes, maxMistakes } = useGameStore();

  if (!isGameOver) return null;

  const handleGiveExtraLife = () => {
    // Grant extra chance
    const currentState = gameStore.getState();
    const storageKey = 'active_game_state';
    const modified = {
      ...currentState,
      mistakes: Math.max(0, currentState.mistakes - 1),
      isGameOver: false,
    };
    // Update store state directly
    localStorage.setItem(`lumora_${storageKey}`, JSON.stringify(modified));
    window.location.reload(); // Quick refresh to cleanly rehydrate state
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-sm rounded-3xl glass-panel p-6 sm:p-8 flex flex-col items-center border border-rose-500/30 shadow-2xl text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_25px_rgba(244,63,94,0.4)]">
          <HeartCrack className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">Out of Lives!</h3>
        <p className="text-xs text-slate-300 mb-6">
          You made {mistakes} mistakes in Challenge Mode ({maxMistakes} max allowed).
        </p>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => gameStore.restartGame()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Puzzle</span>
          </button>

          <button
            onClick={() => {
              gameStore.startNewGame();
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-teal-300" />
            <span>Try New Puzzle</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="text-xs text-slate-400 hover:text-white py-1 flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
