import React, { useEffect, useCallback } from 'react';
import { useGameStore, gameStore } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';
import { SudokuCell } from './SudokuCell';
import { updateAchievementProgress } from '../../store/achievementStore';

export const SudokuBoard: React.FC = () => {
  const gameState = useGameStore();
  const [settings] = useSettings();

  const {
    grid,
    initialClues,
    notes,
    selectedCell,
    activeHint,
    isComplete,
    isPaused,
    isGameOver,
  } = gameState;

  // Selected cell coordinates and value
  const selRow = selectedCell?.row ?? -1;
  const selCol = selectedCell?.col ?? -1;
  const selectedVal = selRow >= 0 && selCol >= 0 ? grid[selRow][selCol] : 0;

  // Desktop Keyboard Handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isComplete || isGameOver || isPaused) return;

      // Navigation: Arrows or WASD
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        const r = selRow <= 0 ? 8 : selRow - 1;
        const c = selCol < 0 ? 0 : selCol;
        gameStore.selectCell(r, c);
        return;
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        const r = selRow >= 8 ? 0 : selRow + 1;
        const c = selCol < 0 ? 0 : selCol;
        gameStore.selectCell(r, c);
        return;
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        const r = selRow < 0 ? 0 : selRow;
        const c = selCol <= 0 ? 8 : selCol - 1;
        gameStore.selectCell(r, c);
        return;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        const r = selRow < 0 ? 0 : selRow;
        const c = selCol >= 8 ? 0 : selCol + 1;
        gameStore.selectCell(r, c);
        return;
      }

      // Digits 1-9
      const digitMatch = e.key.match(/^[1-9]$/);
      if (digitMatch) {
        e.preventDefault();
        const num = parseInt(e.key, 10);
        gameStore.inputNumber(num);
        updateAchievementProgress('keyboard_pro', 1);
        return;
      }

      // Erase: Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        gameStore.eraseCell();
        return;
      }

      // Pencil toggle: 'n' or 'N'
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        gameStore.togglePencilMode();
        return;
      }

      // Undo: 'u' or 'U' or Ctrl+Z
      if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z' && !e.shiftKey)) {
        e.preventDefault();
        gameStore.undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        gameStore.redo();
        return;
      }

      // Hint: 'h' or 'H'
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        gameStore.requestHint();
        return;
      }
    },
    [selRow, selCol, isComplete, isGameOver, isPaused]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-square mx-auto p-1.5 sm:p-2.5 rounded-2xl glass-panel shadow-2xl border border-white/15">
      {/* 9x9 Grid */}
      <div
        role="grid"
        aria-label="Sudoku Grid"
        className="grid grid-cols-9 grid-rows-9 w-full h-full bg-black/20 rounded-xl overflow-hidden border border-white/10"
      >
        {grid.map((rowArr, r) =>
          rowArr.map((val, c) => {
            const isSelected = r === selRow && c === selCol;
            const isSameVal =
              settings.highlightSelectedNumber &&
              selectedVal !== 0 &&
              val === selectedVal &&
              !isSelected;
            const isSameReg =
              settings.highlightRegion &&
              selRow >= 0 &&
              (r === selRow ||
                c === selCol ||
                (Math.floor(r / 3) === Math.floor(selRow / 3) &&
                  Math.floor(c / 3) === Math.floor(selCol / 3))) &&
              !isSelected;

            const isHintTarget =
              activeHint !== null &&
              activeHint.cell.row === r &&
              activeHint.cell.col === c;

            const isHintRelated =
              activeHint !== null &&
              activeHint.relatedCells.some(cell => cell.row === r && cell.col === c);

            // Error detection: Check if val has duplicate in row, col, or box
            let isError = false;
            if (settings.highlightDuplicates && val !== 0 && initialClues[r][c] === 0) {
              for (let i = 0; i < 9; i++) {
                if (i !== c && grid[r][i] === val) isError = true;
                if (i !== r && grid[i][c] === val) isError = true;
              }
              const bR = Math.floor(r / 3) * 3;
              const bC = Math.floor(c / 3) * 3;
              for (let br = 0; br < 3; br++) {
                for (let bc = 0; bc < 3; bc++) {
                  if ((bR + br !== r || bC + bc !== c) && grid[bR + br][bC + bc] === val) {
                    isError = true;
                  }
                }
              }
            }

            return (
              <SudokuCell
                key={`${r}-${c}`}
                row={r}
                col={c}
                value={val}
                initial={initialClues[r][c] !== 0}
                notes={notes[r][c]}
                isSelected={isSelected}
                isSameValue={isSameVal}
                isSameRegion={isSameReg}
                isHintTarget={isHintTarget}
                isHintRelated={isHintRelated}
                isError={isError}
                cellStyle={settings.cellStyle}
                fontFamily={settings.font}
                theme={settings.theme}
                largeText={settings.largeText}
                highContrast={settings.highContrast}
                onClick={() => gameStore.selectCell(r, c)}
              />
            );
          })
        )}
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 z-30 animate-pop-number">
          <p className="text-xl font-bold text-white mb-2">Game Paused</p>
          <p className="text-sm text-slate-300 mb-6 text-center">Take a mindful breath</p>
          <button
            onClick={() => gameStore.resumeGame()}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl shadow-lg transition-all active:scale-95"
          >
            Resume Puzzle
          </button>
        </div>
      )}
    </div>
  );
};
