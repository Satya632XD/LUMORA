import { Difficulty, GameMode } from '../types/sudoku';

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}:${String(remMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateShareCard(params: {
  mode: GameMode;
  difficulty: Difficulty;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
  score: number;
  dailyNumber?: number;
}): string {
  const stars = params.mistakes === 0 && params.hintsUsed === 0
    ? '⭐⭐⭐ Flawless'
    : params.mistakes === 0
    ? '⭐⭐ Perfect'
    : '⭐ Solved';

  const modeLabel = params.mode === 'daily'
    ? `Daily Challenge #${params.dailyNumber || '1'}`
    : `${capitalize(params.difficulty)} Mode`;

  return [
    `✨ LUMORA — The Art of Sudoku`,
    `🧩 ${modeLabel}`,
    `⏱️ Time: ${formatTime(params.timeSeconds)} | 🏆 Score: ${formatNumber(params.score)}`,
    `❌ Mistakes: ${params.mistakes} | 💡 Hints: ${params.hintsUsed}`,
    `${stars}`,
    `Play: https://lumora.sudoku`
  ].join('\n');
}
