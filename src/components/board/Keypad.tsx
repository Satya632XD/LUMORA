import React from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';

export const Keypad: React.FC = () => {
  const { grid, selectedDigit } = useGameStore();
  const [settings] = useSettings();

  // Calculate remaining counts for 1..9
  const counts: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (v >= 1 && v <= 9) {
        counts[v]++;
      }
    }
  }

  const handleDigitClick = (digit: number) => {
    if (settings.inputMode === 'digit-first') {
      // Toggle selected digit brush
      gameStore.selectDigit(selectedDigit === digit ? null : digit);
    } else {
      gameStore.inputNumber(digit);
    }
  };

  const getThemeButtonAccent = (isCompleted: boolean, isSelectedBrush: boolean) => {
    if (isCompleted) {
      return 'opacity-30 pointer-events-none bg-white/5 text-slate-500 border-white/5';
    }
    if (isSelectedBrush) {
      switch (settings.theme) {
        case 'aurora':
          return 'bg-teal-500 text-slate-950 ring-2 ring-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-105';
        case 'crystal':
          return 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-200 shadow-[0_0_15px_rgba(103,232,249,0.5)] scale-105';
        case 'midnight':
          return 'bg-indigo-500 text-white ring-2 ring-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.5)] scale-105';
        case 'zen':
          return 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_15px_rgba(134,239,172,0.5)] scale-105';
        case 'royal':
          return 'bg-amber-400 text-slate-950 ring-2 ring-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.6)] scale-105';
      }
    }
    return 'bg-white/10 hover:bg-white/15 text-slate-100 border-white/10 active:scale-95';
  };

  return (
    <div className="w-full max-w-[440px] sm:max-w-[480px] mx-auto grid grid-cols-9 gap-1 sm:gap-2 px-1 py-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const remaining = 9 - counts[num];
        const isCompleted = remaining <= 0;
        const isSelectedBrush = settings.inputMode === 'digit-first' && selectedDigit === num;

        return (
          <button
            key={num}
            type="button"
            aria-label={`Enter number ${num}, ${remaining} remaining`}
            onClick={() => handleDigitClick(num)}
            className={`relative flex flex-col items-center justify-center py-2 sm:py-3 rounded-xl border backdrop-blur-md transition-all duration-150 ${getThemeButtonAccent(
              isCompleted,
              isSelectedBrush
            )}`}
          >
            <span className="text-xl sm:text-2xl font-bold leading-none">{num}</span>
            {settings.showRemainingCounts && (
              <span className="text-[10px] leading-tight mt-0.5 opacity-70">
                {isCompleted ? '✓' : remaining}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
