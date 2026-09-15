import { useState, useEffect } from 'react';
import {
  ActiveGameState,
  CellCoord,
  Difficulty,
  GameMode,
  MoveRecord,
  SmartHint,
} from '../types/sudoku';
import { generatePuzzle } from '../engine/generator';
import { getCuratedPuzzle } from '../engine/puzzleLibrary';
import { getSmartHint } from '../engine/hintEngine';
import { soundEngine } from '../audio/soundEngine';
import { storage } from '../utils/storage';
import { addXP, recordGameFinished } from './profileStore';
import { updateAchievementProgress } from './achievementStore';
import { getTodayDateString } from '../utils/dailySeed';
import { getSettings } from './settingsStore';

const GAME_STATE_KEY = 'active_game_state';

export interface GameStoreState extends ActiveGameState {
  selectedCell: CellCoord | null;
  selectedDigit: number | null; // For digit-first mode
  isPencilMode: boolean;
  activeHint: SmartHint | null;
  history: MoveRecord[];
  redoStack: MoveRecord[];
}

const PAR_TIMES: Record<Difficulty, number> = {
  beginner: 180,  // 3:00
  easy: 240,      // 4:00
  medium: 360,    // 6:00
  hard: 480,      // 8:00
  expert: 600,    // 10:00
  master: 780,    // 13:00
  grandmaster: 960 // 16:00
};

function createInitialState(
  mode: GameMode = 'classic',
  difficulty: Difficulty = 'medium',
  seed?: string
): GameStoreState {
  // Use curated seed for zero-latency instant start, or fallback to generator
  let puzzleDef = getCuratedPuzzle(difficulty);
  if (!puzzleDef || seed) {
    puzzleDef = generatePuzzle(difficulty, seed);
  }

  const initialGrid = puzzleDef.puzzle.map(row => [...row]);
  const solution = puzzleDef.solution.map(row => [...row]);
  const notes = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => [] as number[])
  );

  return {
    mode,
    difficulty,
    puzzleId: puzzleDef.id,
    initialClues: puzzleDef.puzzle.map(r => [...r]),
    solution,
    grid: initialGrid,
    notes,
    timer: 0,
    mistakes: 0,
    maxMistakes: mode === 'challenge' ? 3 : 0,
    hintsUsed: 0,
    isComplete: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    multiplier: 1,
    speedParTime: PAR_TIMES[difficulty],
    selectedCell: null,
    selectedDigit: null,
    isPencilMode: false,
    activeHint: null,
    history: [],
    redoStack: [],
  };
}

let activeState: GameStoreState = storage.getItem<GameStoreState>(
  GAME_STATE_KEY,
  createInitialState('classic', 'medium')
);

type GameListener = (state: GameStoreState) => void;
const listeners = new Set<GameListener>();

function notify() {
  storage.setItem(GAME_STATE_KEY, activeState);
  listeners.forEach(fn => fn(activeState));
}

// Check if a line (row, col, or box) has just completed
function checkCompletionEvents(prevGrid: number[][], nextGrid: number[][], row: number, col: number) {
  // Check row
  const rowWasFull = prevGrid[row].every(v => v !== 0);
  const rowNowFull = nextGrid[row].every(v => v !== 0);
  if (!rowWasFull && rowNowFull) {
    soundEngine.playLineComplete();
    updateAchievementProgress('fill_row_first', 1);
  }

  // Check column
  const colWasFull = prevGrid.every(r => r[col] !== 0);
  const colNowFull = nextGrid.every(r => r[col] !== 0);
  if (!colWasFull && colNowFull) {
    soundEngine.playLineComplete();
    updateAchievementProgress('fill_col_first', 1);
  }

  // Check 3x3 Box
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  let boxWasFull = true;
  let boxNowFull = true;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (prevGrid[boxR + r][boxC + c] === 0) boxWasFull = false;
      if (nextGrid[boxR + r][boxC + c] === 0) boxNowFull = false;
    }
  }
  if (!boxWasFull && boxNowFull) {
    soundEngine.playLineComplete();
    updateAchievementProgress('fill_box_first', 1);
  }
}

// Check if entire board is solved
function checkFullWin(grid: number[][], solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

export const gameStore = {
  getState: (): GameStoreState => activeState,

  startNewGame: (
    difficulty: Difficulty = activeState.difficulty,
    mode: GameMode = activeState.mode,
    seed?: string
  ) => {
    activeState = createInitialState(mode, difficulty, seed);
    notify();
    updateAchievementProgress('first_steps', 1);
    updateAchievementProgress(`theme_${getSettings().theme}`, 1);
  },

  selectCell: (row: number, col: number) => {
    if (activeState.isComplete || activeState.isGameOver || activeState.isPaused) return;

    soundEngine.playCellSelect();
    const settings = getSettings();

    // If in Digit-First input mode and a digit is selected, place the digit immediately
    const digitToPlace = activeState.selectedDigit;
    if (settings.inputMode === 'digit-first' && digitToPlace !== null) {
      activeState = {
        ...activeState,
        selectedCell: { row, col },
      };
      gameStore.inputNumber(digitToPlace, row, col);
      return;
    }

    activeState = {
      ...activeState,
      selectedCell: { row, col },
    };
    notify();
  },

  selectDigit: (digit: number | null) => {
    activeState = {
      ...activeState,
      selectedDigit: digit,
    };
    notify();
  },

  togglePencilMode: () => {
    activeState = {
      ...activeState,
      isPencilMode: !activeState.isPencilMode,
    };
    soundEngine.playPencilTick();
    notify();
  },

  inputNumber: (num: number, targetRow?: number, targetCol?: number) => {
    if (activeState.isComplete || activeState.isGameOver || activeState.isPaused) return;

    const row = targetRow ?? activeState.selectedCell?.row;
    const col = targetCol ?? activeState.selectedCell?.col;

    if (row === undefined || col === undefined) return;
    if (activeState.initialClues[row][col] !== 0) return; // Cannot overwrite initial clue

    const currentVal = activeState.grid[row][col];
    const correctVal = activeState.solution[row][col];
    const prevGrid = activeState.grid.map(r => [...r]);
    const prevNotes = [...activeState.notes[row][col]];

    // --- PENCIL NOTES MODE ---
    if (activeState.isPencilMode) {
      soundEngine.playPencilTick();
      const updatedNotes = [...prevNotes];
      const idx = updatedNotes.indexOf(num);
      if (idx >= 0) {
        updatedNotes.splice(idx, 1);
      } else {
        updatedNotes.push(num);
        updatedNotes.sort((a, b) => a - b);
      }

      const newNotesGrid = activeState.notes.map((rArr, r) =>
        rArr.map((nArr, c) => (r === row && c === col ? updatedNotes : [...nArr]))
      );

      const move: MoveRecord = {
        row,
        col,
        prevValue: currentVal,
        newValue: currentVal,
        prevNotes,
        newNotes: updatedNotes,
        type: 'notes',
      };

      activeState = {
        ...activeState,
        notes: newNotesGrid,
        history: [...activeState.history, move],
        redoStack: [],
      };

      updateAchievementProgress('notes_placed_50', 1);
      updateAchievementProgress('notes_placed_200', 1);
      updateAchievementProgress('notes_placed_1000', 1);
      notify();
      return;
    }

    // --- VALUE PLACEMENT MODE ---
    // If clicking same number that is already there, erase it
    if (currentVal === num) {
      gameStore.eraseCell(row, col);
      return;
    }

    const isCorrect = num === correctVal;

    if (!isCorrect) {
      soundEngine.playMistake();
      const nextMistakes = activeState.mistakes + 1;
      const isGameOver = activeState.maxMistakes > 0 && nextMistakes >= activeState.maxMistakes;

      activeState = {
        ...activeState,
        mistakes: nextMistakes,
        isGameOver,
        score: Math.max(0, activeState.score - 50),
      };
      notify();
      return;
    }

    // Correct placement!
    soundEngine.playNumberPlaced(num);
    const newGrid = activeState.grid.map(r => [...r]);
    newGrid[row][col] = num;

    // Remove candidate 'num' from row, col, and 3x3 box if autoRemoveNotes is on
    const settings = getSettings();
    const newNotes = activeState.notes.map((rArr, r) =>
      rArr.map((nArr, c) => {
        if (r === row && c === col) return [];
        if (settings.autoRemoveNotes) {
          const sameRow = r === row;
          const sameCol = c === col;
          const sameBox = Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3);
          if (sameRow || sameCol || sameBox) {
            return nArr.filter(n => n !== num);
          }
        }
        return [...nArr];
      })
    );

    // Score calculation
    const baseScore = {
      beginner: 50,
      easy: 80,
      medium: 120,
      hard: 180,
      expert: 250,
      master: 350,
      grandmaster: 500,
    }[activeState.difficulty];

    const scoreGain = Math.floor(baseScore * activeState.multiplier);
    const newScore = activeState.score + scoreGain;
    addXP(Math.floor(scoreGain / 4));

    const move: MoveRecord = {
      row,
      col,
      prevValue: currentVal,
      newValue: num,
      prevNotes,
      newNotes: [],
      type: 'value',
    };

    // Check for row/col/box completion chimes
    checkCompletionEvents(prevGrid, newGrid, row, col);

    // Check if entire board is solved
    const isComplete = checkFullWin(newGrid, activeState.solution);

    activeState = {
      ...activeState,
      grid: newGrid,
      notes: newNotes,
      score: newScore,
      isComplete,
      history: [...activeState.history, move],
      redoStack: [],
      activeHint: null,
    };

    if (isComplete) {
      gameStore.handleGameVictory();
    }

    notify();
  },

  eraseCell: (targetRow?: number, targetCol?: number) => {
    if (activeState.isComplete || activeState.isGameOver || activeState.isPaused) return;

    const row = targetRow ?? activeState.selectedCell?.row;
    const col = targetCol ?? activeState.selectedCell?.col;
    if (row === undefined || col === undefined) return;
    if (activeState.initialClues[row][col] !== 0) return;

    const prevVal = activeState.grid[row][col];
    const prevNotes = [...activeState.notes[row][col]];

    if (prevVal === 0 && prevNotes.length === 0) return;

    soundEngine.playErase();

    const newGrid = activeState.grid.map(r => [...r]);
    newGrid[row][col] = 0;

    const newNotes = activeState.notes.map((rArr, r) =>
      rArr.map((nArr, c) => (r === row && c === col ? [] : [...nArr]))
    );

    const move: MoveRecord = {
      row,
      col,
      prevValue: prevVal,
      newValue: 0,
      prevNotes,
      newNotes: [],
      type: 'clear',
    };

    activeState = {
      ...activeState,
      grid: newGrid,
      notes: newNotes,
      history: [...activeState.history, move],
      redoStack: [],
    };
    notify();
  },

  undo: () => {
    if (activeState.history.length === 0 || activeState.isComplete || activeState.isGameOver) return;

    soundEngine.playErase();
    const lastMove = activeState.history[activeState.history.length - 1];
    const newHistory = activeState.history.slice(0, -1);

    const newGrid = activeState.grid.map(r => [...r]);
    newGrid[lastMove.row][lastMove.col] = lastMove.prevValue;

    const newNotes = activeState.notes.map((rArr, r) =>
      rArr.map((nArr, c) => (r === lastMove.row && c === lastMove.col ? [...lastMove.prevNotes] : [...nArr]))
    );

    activeState = {
      ...activeState,
      grid: newGrid,
      notes: newNotes,
      selectedCell: { row: lastMove.row, col: lastMove.col },
      history: newHistory,
      redoStack: [...activeState.redoStack, lastMove],
    };
    updateAchievementProgress('undo_redeem', 1);
    notify();
  },

  redo: () => {
    if (activeState.redoStack.length === 0 || activeState.isComplete || activeState.isGameOver) return;

    soundEngine.playCellSelect();
    const move = activeState.redoStack[activeState.redoStack.length - 1];
    const newRedo = activeState.redoStack.slice(0, -1);

    const newGrid = activeState.grid.map(r => [...r]);
    newGrid[move.row][move.col] = move.newValue;

    const newNotes = activeState.notes.map((rArr, r) =>
      rArr.map((nArr, c) => (r === move.row && c === move.col ? [...move.newNotes] : [...nArr]))
    );

    activeState = {
      ...activeState,
      grid: newGrid,
      notes: newNotes,
      selectedCell: { row: move.row, col: move.col },
      history: [...activeState.history, move],
      redoStack: newRedo,
    };
    notify();
  },

  autoFillNotes: () => {
    if (activeState.isComplete || activeState.isGameOver) return;

    soundEngine.playPencilTick();
    const newNotes = activeState.notes.map(r => r.map(c => [...c]));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (activeState.grid[r][c] === 0) {
          const used = new Set<number>();
          for (let i = 0; i < 9; i++) {
            if (activeState.grid[r][i] !== 0) used.add(activeState.grid[r][i]);
            if (activeState.grid[i][c] !== 0) used.add(activeState.grid[i][c]);
          }
          const boxR = Math.floor(r / 3) * 3;
          const boxC = Math.floor(c / 3) * 3;
          for (let br = 0; br < 3; br++) {
            for (let bc = 0; bc < 3; bc++) {
              const val = activeState.grid[boxR + br][boxC + bc];
              if (val !== 0) used.add(val);
            }
          }

          const cands: number[] = [];
          for (let n = 1; n <= 9; n++) {
            if (!used.has(n)) cands.push(n);
          }
          newNotes[r][c] = cands;
        }
      }
    }

    activeState = {
      ...activeState,
      notes: newNotes,
    };
    updateAchievementProgress('auto_notes_used', 1);
    notify();
  },

  requestHint: () => {
    if (activeState.isComplete || activeState.isGameOver) return;

    soundEngine.playHint();
    const hint = getSmartHint(activeState.grid, activeState.solution);
    if (hint) {
      activeState = {
        ...activeState,
        activeHint: hint,
        hintsUsed: activeState.hintsUsed + 1,
        selectedCell: hint.cell,
      };
      updateAchievementProgress('smart_hint_learner', 1);
      notify();
    }
  },

  applyHint: () => {
    if (!activeState.activeHint) return;
    const { cell, value } = activeState.activeHint;
    activeState = {
      ...activeState,
      activeHint: null,
    };
    gameStore.inputNumber(value, cell.row, cell.col);
  },

  clearHint: () => {
    activeState = {
      ...activeState,
      activeHint: null,
    };
    notify();
  },

  tickTimer: () => {
    if (activeState.isComplete || activeState.isGameOver || activeState.isPaused) return;

    activeState = {
      ...activeState,
      timer: activeState.timer + 1,
    };
    notify();
  },

  pauseGame: () => {
    if (activeState.isComplete || activeState.isGameOver) return;
    activeState = {
      ...activeState,
      isPaused: true,
    };
    notify();
  },

  resumeGame: () => {
    activeState = {
      ...activeState,
      isPaused: false,
    };
    notify();
  },

  restartGame: () => {
    const initialGrid = activeState.initialClues.map(r => [...r]);
    const emptyNotes = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => [] as number[])
    );

    activeState = {
      ...activeState,
      grid: initialGrid,
      notes: emptyNotes,
      timer: 0,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isGameOver: false,
      isPaused: false,
      score: 0,
      selectedCell: null,
      activeHint: null,
      history: [],
      redoStack: [],
    };
    notify();
  },

  handleGameVictory: () => {
    soundEngine.playVictory();

    const victoryBonus = 500;
    const timeBonus = Math.max(0, Math.floor((activeState.speedParTime - activeState.timer) * 2));
    const flawlessBonus = activeState.mistakes === 0 && activeState.hintsUsed === 0 ? 1000 : 0;
    const finalScore = activeState.score + victoryBonus + timeBonus + flawlessBonus;

    const totalPlaced = activeState.history.filter(m => m.type === 'value').length + activeState.mistakes;
    const accuracy = totalPlaced > 0 ? Math.round(((totalPlaced - activeState.mistakes) / totalPlaced) * 100) : 100;

    // Record game finished in player profile
    recordGameFinished({
      won: true,
      difficulty: activeState.difficulty,
      mode: activeState.mode,
      timeSeconds: activeState.timer,
      score: finalScore,
      hintsUsed: activeState.hintsUsed,
      notesPlaced: activeState.history.filter(m => m.type === 'notes').length,
      accuracy,
      dailyDate: activeState.mode === 'daily' ? getTodayDateString() : undefined,
    });

    // Record Achievements
    updateAchievementProgress('first_victory', 1);
    updateAchievementProgress('solver_5', 1);
    updateAchievementProgress('solver_10', 1);
    updateAchievementProgress('solver_25', 1);
    updateAchievementProgress('solver_50', 1);
    updateAchievementProgress('solver_100', 1);
    updateAchievementProgress(`diff_${activeState.difficulty}_1`, 1);

    if (activeState.mistakes === 0) {
      updateAchievementProgress('zero_mistakes_1', 1);
      updateAchievementProgress('zero_mistakes_5', 1);
      updateAchievementProgress('zero_mistakes_20', 1);
    }
    if (activeState.hintsUsed === 0) {
      updateAchievementProgress('no_hints_1', 1);
      updateAchievementProgress('no_hints_5', 1);
      updateAchievementProgress('no_hints_15', 1);
    }
    if (activeState.mistakes === 0 && activeState.hintsUsed === 0) {
      updateAchievementProgress(`flawless_${activeState.difficulty}`, 1);
    }
    if (activeState.mode === 'daily') {
      updateAchievementProgress('daily_1', 1);
      updateAchievementProgress('daily_3', 1);
      updateAchievementProgress('daily_7', 1);
      updateAchievementProgress('daily_14', 1);
      updateAchievementProgress('daily_30', 1);
    }
    if (activeState.mode === 'endless') {
      updateAchievementProgress('endless_chain_2', 1);
      updateAchievementProgress('endless_chain_5', 1);
      updateAchievementProgress('endless_chain_10', 1);
    }
    if (activeState.timer < 180) {
      updateAchievementProgress('speed_easy_under_3', 1);
    }
    if (activeState.timer < 120) {
      updateAchievementProgress('speed_easy_under_2', 1);
    }

    addXP(600);

    activeState = {
      ...activeState,
      score: finalScore,
      isComplete: true,
    };
    notify();
  },
};

export function useGameStore(): GameStoreState {
  const [state, setState] = useState<GameStoreState>(activeState);

  useEffect(() => {
    const handleUpdate = (updated: GameStoreState) => setState(updated);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return state;
}
