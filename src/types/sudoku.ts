export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'grandmaster';

export type GameMode = 'classic' | 'daily' | 'endless' | 'speedrun' | 'zen' | 'challenge';

export type ThemeId = 'aurora' | 'crystal' | 'midnight' | 'zen' | 'royal';

export type CellStyleId = 'neo-glass' | 'clean-slate' | 'golden-aura' | 'high-contrast';

export type FontFamilyId = 'outfit' | 'playfair' | 'jetbrains';

export type AnimationLevel = 'full' | 'medium' | 'minimal' | 'off';

export type ColorblindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochrome';

export interface CellCoord {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: number; // 0 = empty, 1-9 = filled
  initial: boolean; // given clue
  notes: number[]; // 1-9 pencil marks
  error: boolean; // conflict detected
  highlighted: boolean; // highlighted in current view
  selected: boolean; // currently selected
  sameValue: boolean; // shares same number with selected cell
  sameRegion: boolean; // in same row/col/box as selected cell
  hintHighlight: boolean; // emphasized by active smart hint
  key: string;
}

export type BoardGrid = CellData[][];

export interface MoveRecord {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
  type: 'value' | 'notes' | 'clear';
}

export interface PuzzleDefinition {
  id: string;
  puzzle: number[][]; // 9x9 with 0 for empty
  solution: number[][]; // 9x9 filled
  difficulty: Difficulty;
  seed?: string;
  cluesCount: number;
}

export interface SmartHint {
  cell: CellCoord;
  value: number;
  technique: string;
  summary: string;
  explanation: string;
  relatedCells: CellCoord[];
}

export type PlayerRankTitle = 
  | 'Novice'
  | 'Solver'
  | 'Strategist'
  | 'Analyst'
  | 'Expert'
  | 'Master'
  | 'Grandmaster'
  | 'Luminary';

export interface PlayerRank {
  tier: number; // 1 to 8
  title: PlayerRankTitle;
  minLevel: number;
  color: string;
  badge: string;
}

export interface PlayerProfile {
  xp: number;
  level: number;
  rank: PlayerRankTitle;
  gamesPlayed: number;
  gamesWon: number;
  totalTimePlayed: number; // seconds
  totalHintsUsed: number;
  totalNotesPlaced: number;
  accuracySum: number; // sum of game accuracy percentages
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  completedDailyDates: string[]; // List of YYYY-MM-DD
  fastestTimes: Record<Difficulty, number | null>; // seconds
  bestScores: Record<GameMode, number>;
  endlessStreak: number;
  bestEndlessStreak: number;
}

export type AchievementCategory = 
  | 'milestones'
  | 'difficulties'
  | 'speed'
  | 'perfection'
  | 'streaks'
  | 'tactics'
  | 'mastery';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  iconName: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface GameSettings {
  theme: ThemeId;
  cellStyle: CellStyleId;
  font: FontFamilyId;
  animationLevel: AnimationLevel;
  soundVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  sfxEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  highlightDuplicates: boolean;
  highlightSelectedNumber: boolean;
  highlightRegion: boolean;
  autoRemoveNotes: boolean;
  showRemainingCounts: boolean;
  mistakesLimit: boolean; // 3 lives
  inputMode: 'cell-first' | 'digit-first';
  colorblindMode: ColorblindMode;
  highContrast: boolean;
  largeText: boolean;
}

export interface ActiveGameState {
  mode: GameMode;
  difficulty: Difficulty;
  puzzleId: string;
  initialClues: number[][];
  solution: number[][];
  grid: number[][]; // current values
  notes: number[][][]; // current notes per cell
  timer: number;
  mistakes: number;
  maxMistakes: number;
  hintsUsed: number;
  isComplete: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  multiplier: number;
  speedParTime: number; // for speedrun
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  timeSeconds: number;
  difficulty: Difficulty;
  mode: GameMode;
  rankTitle: PlayerRankTitle;
  country: string;
  date: string;
  isUser?: boolean;
}
