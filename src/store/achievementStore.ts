import { useState, useEffect } from 'react';
import { Achievement, AchievementCategory } from '../types/sudoku';
import { storage } from '../utils/storage';
import { addXP } from './profileStore';

const ACHIEVEMENTS_KEY = 'achievements_data';

// Helper to generate comprehensive 100+ achievements
function createCatalog(): Achievement[] {
  const list: Achievement[] = [];

  // Helper builder
  const add = (
    id: string,
    title: string,
    description: string,
    category: AchievementCategory,
    maxProgress: number,
    xpReward: number,
    iconName: string = 'Trophy'
  ) => {
    list.push({
      id,
      title,
      description,
      category,
      iconName,
      progress: 0,
      maxProgress,
      unlocked: false,
      xpReward,
    });
  };

  // 1. Milestones (20 achievements)
  add('first_steps', 'First Steps', 'Play your very first Sudoku puzzle in Lumora', 'milestones', 1, 100, 'Footprints');
  add('first_victory', 'First Victory', 'Complete any Sudoku puzzle successfully', 'milestones', 1, 200, 'Award');
  add('solver_5', 'Growing Solver', 'Win 5 Sudoku puzzles', 'milestones', 5, 300, 'CheckCircle');
  add('solver_10', 'Puzzle Enthusiast', 'Win 10 Sudoku puzzles', 'milestones', 10, 500, 'Sparkles');
  add('solver_25', 'Dedicated Thinker', 'Win 25 Sudoku puzzles', 'milestones', 25, 800, 'Medal');
  add('solver_50', 'Half-Century', 'Win 50 Sudoku puzzles', 'milestones', 50, 1200, 'Crown');
  add('solver_100', 'Centurion Solver', 'Win 100 Sudoku puzzles', 'milestones', 100, 2000, 'ShieldAlert');
  add('solver_200', 'Bicentennial Mind', 'Win 200 Sudoku puzzles', 'milestones', 200, 3000, 'Trophy');
  add('solver_500', 'Puzzle Virtuoso', 'Win 500 Sudoku puzzles', 'milestones', 500, 5000, 'Flame');
  add('level_5', 'Rising Star', 'Reach Player Level 5', 'milestones', 5, 250, 'Star');
  add('level_10', 'Double Digits', 'Reach Player Level 10', 'milestones', 10, 500, 'Zap');
  add('level_20', 'Seasoned Thinker', 'Reach Player Level 20', 'milestones', 20, 1000, 'Compass');
  add('level_35', 'Lumora Veteran', 'Reach Player Level 35', 'milestones', 35, 1800, 'Crosshair');
  add('level_50', 'Master of Logic', 'Reach Player Level 50', 'milestones', 50, 3000, 'Target');
  add('level_75', 'Ascendant Mind', 'Reach Player Level 75', 'milestones', 75, 4500, 'Sun');
  add('level_100', 'Luminary Ascendant', 'Reach Player Level 100', 'milestones', 100, 10000, 'Sparkle');
  add('play_10_mins', 'Mindful Moment', 'Play Sudoku for at least 10 minutes total', 'milestones', 600, 150, 'Clock');
  add('play_1_hour', 'Deep Immersion', 'Play Sudoku for at least 1 hour total', 'milestones', 3600, 600, 'Hourglass');
  add('play_5_hours', 'Zen Concentration', 'Play Sudoku for at least 5 hours total', 'milestones', 18000, 1800, 'Coffee');
  add('play_24_hours', 'Day of Logic', 'Accumulate 24 hours of total solving time', 'milestones', 86400, 5000, 'Infinity');

  // 2. Difficulties (15 achievements)
  add('diff_beginner_1', 'Beginner Initiate', 'Win a Beginner difficulty puzzle', 'difficulties', 1, 150, 'Smile');
  add('diff_beginner_10', 'Beginner Champion', 'Win 10 Beginner difficulty puzzles', 'difficulties', 10, 400, 'Smile');
  add('diff_easy_1', 'Easy Breezy', 'Win an Easy difficulty puzzle', 'difficulties', 1, 200, 'Feather');
  add('diff_easy_10', 'Easy Scholar', 'Win 10 Easy difficulty puzzles', 'difficulties', 10, 500, 'Feather');
  add('diff_medium_1', 'Finding Balance', 'Win a Medium difficulty puzzle', 'difficulties', 1, 300, 'Scale');
  add('diff_medium_10', 'Medium Maestro', 'Win 10 Medium difficulty puzzles', 'difficulties', 10, 750, 'Scale');
  add('diff_hard_1', 'Trial of Grit', 'Win a Hard difficulty puzzle', 'difficulties', 1, 500, 'Shield');
  add('diff_hard_10', 'Hardened Veteran', 'Win 10 Hard difficulty puzzles', 'difficulties', 10, 1200, 'Shield');
  add('diff_expert_1', 'Master of Nuance', 'Win an Expert difficulty puzzle', 'difficulties', 1, 800, 'Zap');
  add('diff_expert_10', 'Expert Tactician', 'Win 10 Expert difficulty puzzles', 'difficulties', 10, 2000, 'Zap');
  add('diff_master_1', 'Mastery Unlocked', 'Win a Master difficulty puzzle', 'difficulties', 1, 1200, 'Flame');
  add('diff_master_5', 'Grand Sage', 'Win 5 Master difficulty puzzles', 'difficulties', 5, 2500, 'Flame');
  add('diff_gm_1', 'Grandmaster', 'Conquer an elite Grandmaster puzzle', 'difficulties', 1, 2500, 'Crown');
  add('diff_gm_5', 'Ascendant Grandmaster', 'Conquer 5 Grandmaster puzzles', 'difficulties', 5, 5000, 'Crown');
  add('diff_all_clear', 'Complete Spectrum', 'Win at least one puzzle in every difficulty', 'difficulties', 7, 3500, 'Rainbow');

  // 3. Speed (15 achievements)
  add('speed_easy_under_3', 'Casual Sprinter', 'Complete an Easy puzzle in under 3 minutes', 'speed', 1, 350, 'Clock');
  add('speed_easy_under_2', 'Flash of Insight', 'Complete an Easy puzzle in under 2 minutes', 'speed', 1, 600, 'Zap');
  add('speed_med_under_5', 'Swift Analyst', 'Complete a Medium puzzle in under 5 minutes', 'speed', 1, 500, 'Timer');
  add('speed_med_under_3', 'Pace Setter', 'Complete a Medium puzzle in under 3 minutes', 'speed', 1, 900, 'Wind');
  add('speed_hard_under_7', 'Efficient Solver', 'Complete a Hard puzzle in under 7 minutes', 'speed', 1, 750, 'Clock');
  add('speed_hard_under_5', 'Speed Tactician', 'Complete a Hard puzzle in under 5 minutes', 'speed', 1, 1200, 'FastForward');
  add('speed_expert_under_8', 'Lightning Deduction', 'Complete an Expert puzzle in under 8 minutes', 'speed', 1, 1500, 'Zap');
  add('speedrun_win_1', 'First Par', 'Win a Speed Run match beating the target par time', 'speed', 1, 400, 'Flag');
  add('speedrun_win_5', 'Sprint Machine', 'Win 5 Speed Run matches under par time', 'speed', 5, 1200, 'Flag');
  add('speedrun_win_15', 'Chrono Lord', 'Win 15 Speed Run matches under par time', 'speed', 15, 3000, 'Timer');
  add('fast_first_5_cells', 'Rapid Start', 'Fill 5 correct digits within the first 15 seconds', 'speed', 1, 250, 'Zap');
  add('speed_flawless_fast', 'Velocity & Precision', 'Finish a puzzle in under 4 minutes with 0 mistakes', 'speed', 1, 1000, 'Check');
  add('sub_minute_clutch', 'Sub-Minute Miracles', 'Fill 15 numbers in under 60 seconds without errors', 'speed', 1, 800, 'Zap');
  add('lightning_streak', 'Cadence Solver', 'Place 10 numbers in succession with < 3s intervals', 'speed', 1, 500, 'Flame');
  add('turbo_finisher', 'Turbo Finisher', 'Fill the final 9 numbers of a board in under 12 seconds', 'speed', 1, 400, 'Sparkles');

  // 4. Perfection & Accuracy (15 achievements)
  add('zero_mistakes_1', 'Clean Sheet', 'Complete a puzzle with 0 mistakes', 'perfection', 1, 250, 'CheckCircle2');
  add('zero_mistakes_5', 'Surgical Precision', 'Complete 5 puzzles with 0 mistakes', 'perfection', 5, 750, 'CheckCircle2');
  add('zero_mistakes_20', 'Flawless Mind', 'Complete 20 puzzles with 0 mistakes', 'perfection', 20, 2000, 'CheckCircle2');
  add('no_hints_1', 'Pure Intuition', 'Complete a Medium or higher puzzle without using hints', 'perfection', 1, 300, 'Eye');
  add('no_hints_5', 'Self-Reliant', 'Complete 5 puzzles without any hints', 'perfection', 5, 800, 'Eye');
  add('no_hints_15', 'Autonomous Thinker', 'Complete 15 puzzles without any hints', 'perfection', 15, 2000, 'Eye');
  add('flawless_hard', 'Perfection on Hard', 'Complete a Hard puzzle with 0 mistakes and 0 hints', 'perfection', 1, 1200, 'ShieldCheck');
  add('flawless_expert', 'Masterpiece', 'Complete an Expert puzzle with 0 mistakes and 0 hints', 'perfection', 1, 2500, 'Gem');
  add('flawless_gm', 'Divine Harmony', 'Complete a Grandmaster puzzle with 0 mistakes and 0 hints', 'perfection', 1, 5000, 'Crown');
  add('accuracy_95', 'Sharp Eye', 'Finish a game with >= 95% placement accuracy', 'perfection', 1, 200, 'Target');
  add('accuracy_100', 'Bullseye', 'Finish a game with 100% placement accuracy', 'perfection', 1, 500, 'Crosshair');
  add('never_erased', 'Permanent Ink', 'Solve a Medium+ puzzle without using the eraser once', 'perfection', 1, 600, 'PenTool');
  add('zero_notes_win', 'Blindfold Master', 'Solve a Hard+ puzzle without taking any pencil notes', 'perfection', 1, 1500, 'EyeOff');
  add('no_undo_win', 'Steadfast Decision', 'Win a Medium+ puzzle without pressing Undo', 'perfection', 1, 450, 'RotateCcw');
  add('triple_crown', 'Triple Crown', 'Win with 0 mistakes, 0 hints, and beating the par time', 'perfection', 1, 2000, 'Trophy');

  // 5. Streaks & Daily (15 achievements)
  add('streak_3', 'On a Roll', 'Achieve a 3-game win streak', 'streaks', 3, 300, 'Flame');
  add('streak_7', 'Blazing Focus', 'Achieve a 7-game win streak', 'streaks', 7, 700, 'Flame');
  add('streak_15', 'Unstoppable Momentum', 'Achieve a 15-game win streak', 'streaks', 15, 1800, 'Flame');
  add('streak_30', 'Titan of Consistency', 'Achieve a 30-game win streak', 'streaks', 30, 4000, 'Flame');
  add('daily_1', 'Daily Habit', 'Complete your first Daily Challenge', 'streaks', 1, 300, 'Calendar');
  add('daily_3', 'Daily Triad', 'Complete 3 Daily Challenges', 'streaks', 3, 600, 'Calendar');
  add('daily_7', 'Week of Dedication', 'Complete 7 Daily Challenges', 'streaks', 7, 1200, 'Calendar');
  add('daily_14', 'Fortnight Devotee', 'Complete 14 Daily Challenges', 'streaks', 14, 2500, 'Calendar');
  add('daily_30', 'Monthly Conqueror', 'Complete 30 Daily Challenges', 'streaks', 30, 5000, 'Calendar');
  add('endless_chain_2', 'Endless Voyager', 'Complete 2 consecutive puzzles in Endless Mode', 'streaks', 2, 400, 'Repeat');
  add('endless_chain_5', 'Endless Wanderer', 'Complete 5 consecutive puzzles in Endless Mode', 'streaks', 5, 1200, 'Repeat');
  add('endless_chain_10', 'Infinite Mind', 'Complete 10 consecutive puzzles in Endless Mode', 'streaks', 10, 3000, 'Infinity');
  add('challenge_mode_1', 'Heart of Iron', 'Win a Challenge Mode puzzle with mistakes limited', 'streaks', 1, 500, 'Heart');
  add('challenge_mode_5', 'Survivor', 'Win 5 Challenge Mode matches', 'streaks', 5, 1800, 'Heart');
  add('zen_unwind', 'Peace of Mind', 'Complete 3 puzzles in Zen Mode', 'streaks', 3, 400, 'Cloud');

  // 6. Tactics & Board Play (15 achievements)
  add('notes_placed_50', 'Note Taker', 'Place 50 pencil notes on the board', 'tactics', 50, 150, 'Edit3');
  add('notes_placed_200', 'Cartographer', 'Place 200 pencil notes on the board', 'tactics', 200, 350, 'Edit3');
  add('notes_placed_1000', 'Mind Mapper', 'Place 1,000 pencil notes on the board', 'tactics', 1000, 1000, 'Brain');
  add('auto_notes_used', 'Tech Assist', 'Use Auto-Notes to populate candidates', 'tactics', 1, 100, 'Wand2');
  add('smart_hint_learner', 'Eager Student', 'Read and follow a Smart Hint explanation', 'tactics', 1, 150, 'HelpCircle');
  add('fill_row_first', 'Row Striker', 'Completely fill any row before completing any 3×3 box', 'tactics', 1, 250, 'Minus');
  add('fill_col_first', 'Pillar Builder', 'Completely fill any column before completing any 3×3 box', 'tactics', 1, 250, 'Split');
  add('fill_box_first', 'Box Master', 'Completely fill a 3×3 box before finishing any row or column', 'tactics', 1, 250, 'Grid');
  add('clear_all_9s', 'Nines Down', 'Place all 9 instances of a specific number before any other', 'tactics', 1, 300, 'CheckSquare');
  add('number_sweep', 'Number Sweep', 'Place 5 consecutive correct instances of the same digit', 'tactics', 1, 200, 'Sparkles');
  add('digit_first_mode', 'Digit Explorer', 'Use the Digit-First keypad mode to place 10 numbers', 'tactics', 10, 200, 'LayoutGrid');
  add('keyboard_pro', 'Keyboard Maestro', 'Place 20 digits using desktop keyboard number keys', 'tactics', 20, 300, 'Keyboard');
  add('erase_corrector', 'Second Thought', 'Erase an incorrect number and immediately place the right one', 'tactics', 1, 150, 'Eraser');
  add('undo_redeem', 'Time Traveler', 'Use Undo and correct your path to victory', 'tactics', 1, 100, 'Undo');
  add('full_board_notes', 'Pencil Artist', 'Have pencil notes in at least 30 cells simultaneously', 'tactics', 30, 400, 'Pen');

  // 7. Customization & Mastery (10 achievements)
  add('theme_aurora', 'Northern Lights', 'Play a game in the Aurora Theme', 'mastery', 1, 150, 'Palette');
  add('theme_crystal', 'Prismatic Clarity', 'Play a game in the Crystal Theme', 'mastery', 1, 150, 'Palette');
  add('theme_midnight', 'Midnight Contemplation', 'Play a game in the Midnight Theme', 'mastery', 1, 150, 'Palette');
  add('theme_zen', 'Tranquil Grove', 'Play a game in the Zen Theme', 'mastery', 1, 150, 'Palette');
  add('theme_royal', 'Gilded Elegance', 'Play a game in the Royal Theme', 'mastery', 1, 150, 'Palette');
  add('try_all_themes', 'Theme Connoisseur', 'Play at least one game in each of the 5 visual themes', 'mastery', 5, 800, 'Sparkles');
  add('change_cell_style', 'Interior Decorator', 'Change the Cell Style in settings', 'mastery', 1, 100, 'Sliders');
  add('change_font_family', 'Typophile', 'Change the game typography font', 'mastery', 1, 100, 'Type');
  add('sound_composer', 'Sound Sculptor', 'Adjust ambient music or SFX sound settings', 'mastery', 1, 100, 'Volume2');
  add('accessible_play', 'Adaptive Thinker', 'Toggle any accessibility setting (high contrast / large text)', 'mastery', 1, 150, 'Eye');

  return list;
}

// Initial catalog
const INITIAL_CATALOG = createCatalog();

// Load stored progress and merge with catalog
function loadAchievements(): Achievement[] {
  const stored = storage.getItem<Record<string, { progress: number; unlocked: boolean; unlockedAt?: string }>>(
    ACHIEVEMENTS_KEY,
    {}
  );

  return INITIAL_CATALOG.map(item => {
    const s = stored[item.id];
    if (s) {
      return {
        ...item,
        progress: Math.min(item.maxProgress, s.progress),
        unlocked: s.unlocked,
        unlockedAt: s.unlockedAt,
      };
    }
    return item;
  });
}

let activeAchievements = loadAchievements();

type AchievementListener = (list: Achievement[], newlyUnlocked?: Achievement) => void;
const listeners = new Set<AchievementListener>();

function saveAndNotify(newlyUnlocked?: Achievement) {
  const map: Record<string, { progress: number; unlocked: boolean; unlockedAt?: string }> = {};
  activeAchievements.forEach(a => {
    map[a.id] = { progress: a.progress, unlocked: a.unlocked, unlockedAt: a.unlockedAt };
  });
  storage.setItem(ACHIEVEMENTS_KEY, map);

  listeners.forEach(fn => fn(activeAchievements, newlyUnlocked));
}

export function updateAchievementProgress(
  id: string,
  amount: number = 1,
  mode: 'increment' | 'set' = 'increment'
): Achievement | null {
  let unlockedItem: Achievement | null = null;

  activeAchievements = activeAchievements.map(item => {
    if (item.id !== id) return item;
    if (item.unlocked) return item;

    const newProgress = mode === 'increment' ? item.progress + amount : amount;
    const capped = Math.min(item.maxProgress, Math.max(0, newProgress));
    const nowUnlocked = capped >= item.maxProgress;

    if (nowUnlocked && !item.unlocked) {
      unlockedItem = {
        ...item,
        progress: capped,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      addXP(item.xpReward);
      return unlockedItem;
    }

    return {
      ...item,
      progress: capped,
    };
  });

  if (unlockedItem) {
    saveAndNotify(unlockedItem);
  } else {
    saveAndNotify();
  }

  return unlockedItem;
}

export function getAchievements(): Achievement[] {
  return activeAchievements;
}

export function useAchievements(): {
  achievements: Achievement[];
  recentUnlock: Achievement | null;
  clearRecentUnlock: () => void;
} {
  const [achievements, setAchievements] = useState<Achievement[]>(activeAchievements);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    const handleUpdate = (list: Achievement[], unlocked?: Achievement) => {
      setAchievements(list);
      if (unlocked) {
        setRecentUnlock(unlocked);
      }
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    achievements,
    recentUnlock,
    clearRecentUnlock: () => setRecentUnlock(null),
  };
}
