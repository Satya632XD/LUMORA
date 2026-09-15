import { Difficulty, PuzzleDefinition } from '../types/sudoku';
import { copyGrid, createEmptyGrid, hasUniqueSolution, solveSudoku, Grid } from './solver';

interface DifficultyConfig {
  targetClues: number;
  minClues: number;
  maxClues: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  beginner: { targetClues: 48, minClues: 45, maxClues: 52 },
  easy: { targetClues: 40, minClues: 37, maxClues: 43 },
  medium: { targetClues: 34, minClues: 32, maxClues: 36 },
  hard: { targetClues: 29, minClues: 28, maxClues: 31 },
  expert: { targetClues: 26, minClues: 24, maxClues: 27 },
  master: { targetClues: 23, minClues: 22, maxClues: 24 },
  grandmaster: { targetClues: 20, minClues: 18, maxClues: 21 },
};

/**
 * Deterministic Linear Congruential PRNG for seeded puzzles (Daily Challenge).
 */
export class SeededRNG {
  private state: number;

  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    this.state = Math.abs(hash) || 123456789;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    return this.state / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

/**
 * Generates a completely filled, legally valid 9x9 Sudoku board.
 */
export function generateSolvedBoard(rng?: SeededRNG): Grid {
  const empty = createEmptyGrid();
  // Fill first 3 diagonal blocks independently (they don't overlap) for speed
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let b = 0; b < 9; b += 3) {
    const shuffled = rng ? rng.shuffle(nums) : [...nums].sort(() => Math.random() - 0.5);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        empty[b + r][b + c] = shuffled[idx++];
      }
    }
  }

  const { solved, solution } = solveSudoku(empty, true);
  if (solved && solution) {
    return solution;
  }
  // Fallback to plain solve
  const fallback = solveSudoku(createEmptyGrid(), true);
  return fallback.solution || createEmptyGrid();
}

/**
 * Generates a puzzle with a guaranteed UNIQUE solution and desired difficulty.
 */
export function generatePuzzle(
  difficulty: Difficulty,
  seed?: string
): PuzzleDefinition {
  const rng = seed ? new SeededRNG(seed) : undefined;
  const solution = generateSolvedBoard(rng);
  const puzzle = copyGrid(solution);

  const config = DIFFICULTY_CONFIG[difficulty];
  const targetRemovals = 81 - config.targetClues;

  // Build list of all 81 cell coordinates
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  // Shuffle positions to dig clues in random or seeded order
  const shuffledPositions = rng
    ? rng.shuffle(positions)
    : [...positions].sort(() => Math.random() - 0.5);

  let removedCount = 0;

  for (const [r, c] of shuffledPositions) {
    if (removedCount >= targetRemovals) break;
    const originalVal = puzzle[r][c];
    if (originalVal === 0) continue;

    // Speculatively remove value
    puzzle[r][c] = 0;

    // Verify that puzzle still has strictly 1 unique solution
    if (hasUniqueSolution(puzzle)) {
      removedCount++;
    } else {
      // Revert if removal creates multiple solutions
      puzzle[r][c] = originalVal;
    }
  }

  // Count final clues
  let cluesCount = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) cluesCount++;
    }
  }

  const id = seed
    ? `daily_${seed}`
    : `lumora_${difficulty}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    puzzle,
    solution,
    difficulty,
    seed,
    cluesCount,
  };
}
