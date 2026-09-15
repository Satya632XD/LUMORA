import React, { useEffect } from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { formatTime, formatNumber, capitalize } from '../../utils/formatters';
import { ArrowLeft, Pause, Play, Heart, Sliders, Trophy } from 'lucide-react';
import { GameMode } from '../../types/sudoku';

interface GameHeaderProps {
  onBackToMenu: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onBackToMenu,
  onOpenSettings,
  onOpenLeaderboard,
}) => {
  const {
    mode,
    difficulty,
    timer,
    mistakes,
    maxMistakes,
    score,
    isPaused,
    isComplete,
  } = useGameStore();

  // Timer interval hook
  useEffect(() => {
    if (isPaused || isComplete || mode === 'zen') return;

    const interval = setInterval(() => {
      gameStore.tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, mode]);

  const getDifficultyBadge = () => {
    const colors: Record<string, string> = {
      beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      easy: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      medium: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      hard: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      expert: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      master: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      grandmaster: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    };
    return colors[difficulty] || 'bg-teal-500/20 text-teal-300 border-teal-500/30';
  };

  const getModeTitle = (m: GameMode) => {
    switch (m) {
      case 'daily': return 'Daily';
      case 'endless': return 'Endless';
      case 'speedrun': return 'Speed Run';
      case 'zen': return 'Zen Sanctuary';
      case 'challenge': return 'Challenge';
      default: return 'Classic';
    }
  };

  return (
    <header className="w-full max-w-[480px] mx-auto flex flex-col gap-2 pt-2 px-2 select-none">
      {/* Top Bar: Nav, Title, Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-medium"
          aria-label="Return to menu"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-slate-200">
            {getModeTitle(mode)}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge()}`}
          >
            {capitalize(difficulty)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenLeaderboard}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all active:scale-95"
            aria-label="View Leaderboards"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all active:scale-95"
            aria-label="Game Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar: Mistakes, Timer, Score */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs">
        {/* Mistakes / Lives */}
        <div className="flex items-center gap-1">
          {mode === 'challenge' ? (
            <div className="flex items-center gap-0.5">
              {[0, 1, 2].map(idx => (
                <Heart
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < (maxMistakes - mistakes)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          ) : mode === 'zen' ? (
            <span className="text-emerald-300 font-medium">Peaceful</span>
          ) : (
            <span className="text-slate-300">
              Mistakes: <strong className="text-white">{mistakes}</strong>
              {maxMistakes > 0 && `/${maxMistakes}`}
            </span>
          )}
        </div>

        {/* Timer */}
        {mode !== 'zen' && (
          <div className="flex items-center gap-1.5 font-mono text-slate-200">
            <span>{formatTime(timer)}</span>
            <button
              onClick={() => (isPaused ? gameStore.resumeGame() : gameStore.pauseGame())}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Score */}
        <div className="text-slate-300">
          Score: <strong className="text-teal-300 font-mono">{formatNumber(score)}</strong>
        </div>
      </div>
    </header>
  );
};
