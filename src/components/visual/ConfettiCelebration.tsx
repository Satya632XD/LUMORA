import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ThemeId } from '../../types/sudoku';

interface ConfettiCelebrationProps {
  active: boolean;
  theme: ThemeId;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ active, theme }) => {
  useEffect(() => {
    if (!active) return;

    const getThemeColors = (): string[] => {
      switch (theme) {
        case 'aurora':
          return ['#2dd4bf', '#38bdf8', '#818cf8', '#f43f5e', '#ffffff'];
        case 'crystal':
          return ['#67e8f9', '#c084fc', '#f472b6', '#38bdf8', '#ffffff'];
        case 'midnight':
          return ['#818cf8', '#a78bfa', '#c084fc', '#38bdf8', '#e2e8f0'];
        case 'zen':
          return ['#86efac', '#ca8a04', '#fbcfe8', '#4ade80', '#ffffff'];
        case 'royal':
          return ['#fbbf24', '#f59e0b', '#d97706', '#f43f5e', '#fef08a'];
        default:
          return ['#2dd4bf', '#38bdf8', '#fbbf24'];
      }
    };

    const colors = getThemeColors();

    // First blast from bottom corners
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.85 },
      colors,
    });

    confetti({
      particleCount: 70,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.85 },
      colors,
    });

    // Second cascading burst from center
    const timer = setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [active, theme]);

  return null;
};
