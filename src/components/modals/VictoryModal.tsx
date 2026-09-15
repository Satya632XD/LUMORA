import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';
import { formatTime, formatNumber, capitalize, generateShareCard } from '../../utils/formatters';
import { Trophy, Clock, CheckCircle2, Share2, ArrowRight, RotateCcw } from 'lucide-react';
import { ConfettiCelebration } from '../visual/ConfettiCelebration';

interface VictoryModalProps {
  onNextPuzzle: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ onNextPuzzle, onBackToMenu }) => {
  const gameState = useGameStore();
  const [settings] = useSettings();
  const [copied, setCopied] = useState(false);

  if (!gameState.isComplete) return null;

  const totalMoves = gameState.history.filter(m => m.type === 'value').length + gameState.mistakes;
  const accuracy = totalMoves > 0 ? Math.round(((totalMoves - gameState.mistakes) / totalMoves) * 100) : 100;

  const handleShare = () => {
    const text = generateShareCard({
      mode: gameState.mode,
      difficulty: gameState.difficulty,
      timeSeconds: gameState.timer,
      mistakes: gameState.mistakes,
      hintsUsed: gameState.hintsUsed,
      score: gameState.score,
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <ConfettiCelebration active={true} theme={settings.theme} />

      <div className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-8 flex flex-col items-center border border-white/20 shadow-2xl relative text-center">
        {/* Victory Icon / Trophy */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.6)] mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1">
          Puzzle Conquered!
        </h2>
        <p className="text-sm text-teal-300 font-medium mb-6">
          {capitalize(gameState.difficulty)} • {capitalize(gameState.mode)}
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {formatTime(gameState.timer)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accuracy
            </span>
            <span className="text-lg font-bold font-mono text-teal-300">
              {accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-slate-400 mb-1">Mistakes</span>
            <span className="text-lg font-bold font-mono text-slate-200">
              {gameState.mistakes}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-slate-400 mb-1">Final Score</span>
            <span className="text-lg font-bold font-mono text-amber-300">
              {formatNumber(gameState.score)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onNextPuzzle}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Next Puzzle</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
            </button>

            <button
              onClick={() => gameStore.restartGame()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-all active:scale-95"
              aria-label="Replay puzzle"
              title="Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onBackToMenu}
            className="text-xs text-slate-400 hover:text-white py-1 transition-colors"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
