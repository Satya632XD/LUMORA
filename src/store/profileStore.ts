import { useState, useEffect } from 'react';
import { PlayerProfile, PlayerRank, PlayerRankTitle, Difficulty, GameMode } from '../types/sudoku';
import { storage } from '../utils/storage';

const PROFILE_KEY = 'player_profile';

export const RANKS: PlayerRank[] = [
  { tier: 1, title: 'Novice', minLevel: 1, color: '#94a3b8', badge: '🌱' },
  { tier: 2, title: 'Solver', minLevel: 5, color: '#38bdf8', badge: '💠' },
  { tier: 3, title: 'Strategist', minLevel: 12, color: '#34d399', badge: '⚡' },
  { tier: 4, title: 'Analyst', minLevel: 20, color: '#818cf8', badge: '🔮' },
  { tier: 5, title: 'Expert', minLevel: 32, color: '#c084fc', badge: '💎' },
  { tier: 6, title: 'Master', minLevel: 48, color: '#f59e0b', badge: '🔥' },
  { tier: 7, title: 'Grandmaster', minLevel: 65, color: '#f43f5e', badge: '👑' },
  { tier: 8, title: 'Luminary', minLevel: 85, color: '#ec4899', badge: '✨' },
];

export function calculateRank(level: number): PlayerRankTitle {
  let activeRank = RANKS[0].title;
  for (const r of RANKS) {
    if (level >= r.minLevel) {
      activeRank = r.title;
    }
  }
  return activeRank;
}

export function xpForNextLevel(level: number): number {
  return Math.floor(level * 180 + Math.pow(level, 1.45) * 80);
}

export const INITIAL_PROFILE: PlayerProfile = {
  xp: 0,
  level: 1,
  rank: 'Novice',
  gamesPlayed: 0,
  gamesWon: 0,
  totalTimePlayed: 0,
  totalHintsUsed: 0,
  totalNotesPlaced: 0,
  accuracySum: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: '',
  completedDailyDates: [],
  fastestTimes: {
    beginner: null,
    easy: null,
    medium: null,
    hard: null,
    expert: null,
    master: null,
    grandmaster: null,
  },
  bestScores: {
    classic: 0,
    daily: 0,
    endless: 0,
    speedrun: 0,
    zen: 0,
    challenge: 0,
  },
  endlessStreak: 0,
  bestEndlessStreak: 0,
};

let currentProfile: PlayerProfile = storage.getItem<PlayerProfile>(PROFILE_KEY, INITIAL_PROFILE);

type ProfileListener = (profile: PlayerProfile) => void;
const listeners = new Set<ProfileListener>();

function notify() {
  storage.setItem(PROFILE_KEY, currentProfile);
  listeners.forEach(fn => fn(currentProfile));
}

export function getProfile(): PlayerProfile {
  return currentProfile;
}

export function addXP(amount: number): { leveledUp: boolean; newLevel: number } {
  let xp = currentProfile.xp + amount;
  let level = currentProfile.level;
  let leveledUp = false;

  let req = xpForNextLevel(level);
  while (xp >= req) {
    xp -= req;
    level++;
    leveledUp = true;
    req = xpForNextLevel(level);
  }

  const rank = calculateRank(level);
  currentProfile = {
    ...currentProfile,
    xp,
    level,
    rank,
  };
  notify();

  return { leveledUp, newLevel: level };
}

export function recordGameFinished(params: {
  won: boolean;
  difficulty: Difficulty;
  mode: GameMode;
  timeSeconds: number;
  score: number;
  hintsUsed: number;
  notesPlaced: number;
  accuracy: number;
  dailyDate?: string;
}) {
  const { won, difficulty, mode, timeSeconds, score, hintsUsed, notesPlaced, accuracy, dailyDate } = params;

  let currentStreak = currentProfile.currentStreak;
  let bestStreak = currentProfile.bestStreak;
  const completedDailyDates = [...currentProfile.completedDailyDates];

  if (won) {
    currentStreak++;
    if (currentStreak > bestStreak) bestStreak = currentStreak;

    if (mode === 'daily' && dailyDate && !completedDailyDates.includes(dailyDate)) {
      completedDailyDates.push(dailyDate);
    }
  } else {
    if (mode !== 'zen') {
      currentStreak = 0;
    }
  }

  // Update fastest times
  const fastestTimes = { ...currentProfile.fastestTimes };
  if (won) {
    const prevFastest = fastestTimes[difficulty];
    if (prevFastest === null || timeSeconds < prevFastest) {
      fastestTimes[difficulty] = timeSeconds;
    }
  }

  // Update best scores
  const bestScores = { ...currentProfile.bestScores };
  if (score > (bestScores[mode] || 0)) {
    bestScores[mode] = score;
  }

  // Endless streak
  let endlessStreak = currentProfile.endlessStreak;
  let bestEndlessStreak = currentProfile.bestEndlessStreak;
  if (mode === 'endless') {
    if (won) {
      endlessStreak++;
      if (endlessStreak > bestEndlessStreak) bestEndlessStreak = endlessStreak;
    } else {
      endlessStreak = 0;
    }
  }

  currentProfile = {
    ...currentProfile,
    gamesPlayed: currentProfile.gamesPlayed + 1,
    gamesWon: currentProfile.gamesWon + (won ? 1 : 0),
    totalTimePlayed: currentProfile.totalTimePlayed + timeSeconds,
    totalHintsUsed: currentProfile.totalHintsUsed + hintsUsed,
    totalNotesPlaced: currentProfile.totalNotesPlaced + notesPlaced,
    accuracySum: currentProfile.accuracySum + accuracy,
    currentStreak,
    bestStreak,
    completedDailyDates,
    fastestTimes,
    bestScores,
    endlessStreak,
    bestEndlessStreak,
  };

  notify();
}

export function useProfile(): PlayerProfile {
  const [profile, setProfile] = useState<PlayerProfile>(currentProfile);

  useEffect(() => {
    const handleUpdate = (updated: PlayerProfile) => setProfile(updated);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return profile;
}
