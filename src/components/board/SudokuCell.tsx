import React from 'react';
import { CellCoord, CellStyleId, FontFamilyId, ThemeId } from '../../types/sudoku';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  initial: boolean;
  notes: number[];
  isSelected: boolean;
  isSameValue: boolean;
  isSameRegion: boolean;
  isHintTarget: boolean;
  isHintRelated: boolean;
  isError: boolean;
  cellStyle: CellStyleId;
  fontFamily: FontFamilyId;
  theme: ThemeId;
  largeText: boolean;
  highContrast: boolean;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = React.memo(({
  row,
  col,
  value,
  initial,
  notes,
  isSelected,
  isSameValue,
  isSameRegion,
  isHintTarget,
  isHintRelated,
  isError,
  cellStyle,
  fontFamily,
  theme,
  largeText,
  highContrast,
  onClick,
}) => {
  // Border dividers for 3x3 blocks
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-white/25' : 'border-r border-white/10';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-white/25' : 'border-b border-white/10';

  // Font family class
  const fontClass =
    fontFamily === 'playfair'
      ? 'font-serif'
      : fontFamily === 'jetbrains'
      ? 'font-mono'
      : 'font-sans';

  // Text size
  const textSize = largeText ? 'text-2xl sm:text-3xl font-bold' : 'text-xl sm:text-2xl font-semibold';

  // Theme-specific glow and color accents
  const getThemeAccentClass = () => {
    switch (theme) {
      case 'aurora':
        return {
          selectedBg: 'bg-teal-500/25 ring-2 ring-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]',
          sameValueBg: 'bg-teal-500/15 text-teal-300',
          sameRegionBg: 'bg-white/[0.04]',
          initialText: 'text-slate-100 font-bold',
          userText: 'text-teal-300',
        };
      case 'crystal':
        return {
          selectedBg: 'bg-cyan-500/25 ring-2 ring-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.5)]',
          sameValueBg: 'bg-cyan-500/15 text-cyan-200',
          sameRegionBg: 'bg-white/[0.04]',
          initialText: 'text-white font-bold',
          userText: 'text-cyan-300',
        };
      case 'midnight':
        return {
          selectedBg: 'bg-indigo-500/30 ring-2 ring-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]',
          sameValueBg: 'bg-indigo-500/15 text-indigo-300',
          sameRegionBg: 'bg-white/[0.03]',
          initialText: 'text-slate-100 font-bold',
          userText: 'text-indigo-300',
        };
      case 'zen':
        return {
          selectedBg: 'bg-emerald-500/25 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(134,239,172,0.4)]',
          sameValueBg: 'bg-emerald-500/15 text-emerald-300',
          sameRegionBg: 'bg-white/[0.03]',
          initialText: 'text-stone-100 font-bold',
          userText: 'text-emerald-300',
        };
      case 'royal':
        return {
          selectedBg: 'bg-amber-500/30 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]',
          sameValueBg: 'bg-amber-500/15 text-amber-200',
          sameRegionBg: 'bg-white/[0.04]',
          initialText: 'text-amber-100 font-bold',
          userText: 'text-amber-400',
        };
      default:
        return {
          selectedBg: 'bg-teal-500/25 ring-2 ring-teal-400',
          sameValueBg: 'bg-teal-500/15 text-teal-300',
          sameRegionBg: 'bg-white/[0.04]',
          initialText: 'text-white',
          userText: 'text-teal-300',
        };
    }
  };

  const themeClasses = getThemeAccentClass();

  // Cell style styling
  let cellStyleContainer = '';
  if (cellStyle === 'neo-glass') {
    cellStyleContainer = 'rounded-[6px] transition-all duration-150 backdrop-blur-xs';
  } else if (cellStyle === 'clean-slate') {
    cellStyleContainer = 'rounded-none transition-none';
  } else if (cellStyle === 'golden-aura') {
    cellStyleContainer = 'rounded-[6px] border border-amber-500/20 shadow-inner';
  } else if (cellStyle === 'high-contrast') {
    cellStyleContainer = 'bg-slate-900 border border-slate-700 font-bold';
  }

  // Dynamic state background
  let stateBg = '';
  if (isSelected) {
    stateBg = themeClasses.selectedBg + ' z-20 scale-[1.04]';
  } else if (isHintTarget) {
    stateBg = 'bg-amber-400/30 ring-2 ring-amber-400 animate-pulse z-10';
  } else if (isHintRelated) {
    stateBg = 'bg-indigo-500/20 ring-1 ring-indigo-400/60';
  } else if (isSameValue && value !== 0) {
    stateBg = themeClasses.sameValueBg;
  } else if (isSameRegion) {
    stateBg = themeClasses.sameRegionBg;
  }

  // Error highlighting
  if (isError) {
    stateBg = 'bg-rose-500/30 ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse';
  }

  const textColor = initial
    ? themeClasses.initialText
    : isError
    ? 'text-rose-400'
    : themeClasses.userText;

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ', Empty'}`}
      onClick={onClick}
      className={`relative aspect-square flex items-center justify-center select-none cursor-pointer focus:outline-none ${borderRight} ${borderBottom} ${cellStyleContainer} ${stateBg} transition-transform active:scale-95`}
    >
      {value !== 0 ? (
        <span className={`${fontClass} ${textSize} ${textColor} animate-pop-number`}>
          {value}
        </span>
      ) : (
        /* Pencil Notes 3x3 Sub-Grid */
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <div
              key={n}
              className="flex items-center justify-center text-[8px] sm:text-[10px] leading-none font-medium text-slate-400/80"
            >
              {notes.includes(n) ? n : ''}
            </div>
          ))}
        </div>
      )}
    </button>
  );
});
