/**
 * High-performance Sudoku Solver & Unique Solution Verifier.
 * Uses Backtracking with Forward Checking, Most Constrained Variable (MRV) heuristic,
 * and bitmasks for 60fps instant solving and puzzle validation.
 */

export type Grid = number[][];

export function createEmptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function copyGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

/**
 * Returns bitmask of numbers already used in row, col, and 3x3 block.
 * Bits 1-9 correspond to numbers 1-9.
 */
export function getUsedMask(grid: Grid, row: number, col: number): number {
  let mask = 0;
  // Row and Col
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] !== 0) mask |= (1 << grid[row][i]);
    if (grid[i][col] !== 0) mask |= (1 << grid[i][col]);
  }
  // 3x3 Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const val = grid[startRow + r][startCol + c];
      if (val !== 0) mask |= (1 << val);
    }
  }
  return mask;
}

/**
 * Returns array of valid candidate numbers (1..9) for a cell.
 */
export function getCandidates(grid: Grid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const usedMask = getUsedMask(grid, row, col);
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if ((usedMask & (1 << num)) === 0) {
      candidates.push(num);
    }
  }
  return candidates;
}

/**
 * Checks if number can be legally placed at (row, col) without conflicts.
 */
export function isValidPlacement(grid: Grid, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) return false;
    if (i !== row && grid[i][col] === num) return false;
  }
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cr = boxR + r;
      const cc = boxC + c;
      if ((cr !== row || cc !== col) && grid[cr][cc] === num) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if entire board is completely and correctly solved.
 */
export function isBoardSolved(grid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val < 1 || val > 9) return false;
      if (!isValidPlacement(grid, r, c, val)) return false;
    }
  }
  return true;
}

/**
 * Solves a Sudoku grid using MRV (Minimum Remaining Values) heuristic.
 * If randomized is true, candidates are tried in random order.
 */
export function solveSudoku(
  grid: Grid,
  randomized: boolean = false
): { solved: boolean; solution: Grid | null } {
  const working = copyGrid(grid);

  function solve(): boolean {
    let minCandidates = 10;
    let targetRow = -1;
    let targetCol = -1;
    let bestCandidates: number[] = [];

    // Find empty cell with fewest candidates (MRV heuristic)
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (working[r][c] === 0) {
          const cands = getCandidates(working, r, c);
          if (cands.length === 0) return false; // Dead end
          if (cands.length < minCandidates) {
            minCandidates = cands.length;
            targetRow = r;
            targetCol = c;
            bestCandidates = cands;
            if (minCandidates === 1) break; // Instant choice
          }
        }
      }
      if (minCandidates === 1) break;
    }

    if (targetRow === -1) {
      // No empty cell found -> solved!
      return true;
    }

    if (randomized) {
      // Shuffle candidates in place
      for (let i = bestCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bestCandidates[i], bestCandidates[j]] = [bestCandidates[j], bestCandidates[i]];
      }
    }

    for (const num of bestCandidates) {
      working[targetRow][targetCol] = num;
      if (solve()) return true;
      working[targetRow][targetCol] = 0;
    }

    return false;
  }

  const success = solve();
  return { solved: success, solution: success ? working : null };
}

/**
 * Counts solutions up to maxLimit. Used to ensure a puzzle has strictly 1 unique solution.
 */
export function countSolutions(grid: Grid, maxLimit: number = 2): number {
  const working = copyGrid(grid);
  let count = 0;

  function countRecursive(): boolean {
    let minCandidates = 10;
    let targetRow = -1;
    let targetCol = -1;
    let bestCandidates: number[] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (working[r][c] === 0) {
          const cands = getCandidates(working, r, c);
          if (cands.length === 0) return false;
          if (cands.length < minCandidates) {
            minCandidates = cands.length;
            targetRow = r;
            targetCol = c;
            bestCandidates = cands;
            if (minCandidates === 1) break;
          }
        }
      }
      if (minCandidates === 1) break;
    }

    if (targetRow === -1) {
      count++;
      return count >= maxLimit; // Stop if reached limit
    }

    for (const num of bestCandidates) {
      working[targetRow][targetCol] = num;
      if (countRecursive()) return true;
      working[targetRow][targetCol] = 0;
    }

    return false;
  }

  countRecursive();
  return count;
}

/**
 * Returns whether a puzzle has strictly 1 unique solution.
 */
export function hasUniqueSolution(grid: Grid): boolean {
  return countSolutions(grid, 2) === 1;
}
