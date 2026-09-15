import React from 'react';
import { GameMode, Difficulty } from '../../types/sudoku';
import { LevelProgressWidget } from '../hud/LevelProgressWidget';
import { useProfile } from '../../store/profileStore';
import { getTodayDateString } from '../../utils/dailySeed';
import {
  Play,
  Calendar,
  Infinity,
  Zap,
  CloudSun,
  Flame,
  Trophy,
  Award,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface MainMenuProps {
  onStartGame: (mode: GameMode, difficulty?: Difficulty, seed?: string) => void;
  onOpenDifficultySelect: (mode: GameMode) => void;
  onOpenDailyCalendar: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenDifficultySelect,
  onOpenDailyCalendar,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenSettings,
}) => {
  const profile = useProfile();
  const todayStr = getTodayDateString();
  const isDailyDoneToday = profile.completedDailyDates.includes(todayStr);

  return (
    <div className="w-full h-full flex flex-col justify-between max-w-lg mx-auto px-4 py-6 z-10 overflow-y-auto">
      {/* Top Navbar */}
      <div className="flex items-center justify-between mb-4">
        <LevelProgressWidget onOpenProfile={onOpenProfile} />

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLeaderboard}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all active:scale-95"
            aria-label="Leaderboards"
            title="Leaderboards"
          >
            <Trophy className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAchievements}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all active:scale-95"
            aria-label="Achievements"
            title="Achievements"
          >
            <Award className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all active:scale-95"
            aria-label="Settings"
            title="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Branding */}
      <div className="text-center my-auto py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium 2D Sudoku</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm mb-2">
          LUMORA
        </h1>
        <p className="text-sm sm:text-base text-slate-300/90 font-light tracking-wide max-w-xs mx-auto">
          The Art of Pure Mind & Elegant Logic
        </p>

        {/* Daily Challenge Hero Banner */}
        <div className="mt-6 p-4 rounded-3xl glass-panel border border-teal-500/30 shadow-xl bg-gradient-to-r from-teal-500/10 via-slate-900/60 to-sky-500/10 text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                  Today's Quest
                </span>
                <h3 className="text-sm font-bold text-white leading-tight">Daily Challenge</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{profile.currentStreak}d Streak</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {isDailyDoneToday
              ? '★ Today’s puzzle is completed! Check the monthly calendar.'
              : 'Sharpen your skills with today’s unique procedural challenge.'}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onStartGame('daily', 'medium', todayStr)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isDailyDoneToday ? 'Replay Challenge' : 'Play Today'}</span>
            </button>

            <button
              onClick={onOpenDailyCalendar}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-all active:scale-95"
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Game Mode Selection Grid */}
      <div className="space-y-2 mt-4 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Select Game Mode
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* Classic */}
          <button
            onClick={() => onOpenDifficultySelect('classic')}
            className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-teal-400/40 text-left transition-all active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-teal-300" />
              </div>
              <span className="text-[10px] text-slate-400">7 Tiers</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Classic
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Standard Sudoku logic
              </div>
            </div>
          </button>

          {/* Endless */}
          <button
            onClick={() => onOpenDifficultySelect('endless')}
            className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-400/40 text-left transition-all active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                <Infinity className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-400">Streak Combo</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Endless
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Infinite chained boards
              </div>
            </div>
          </button>

          {/* Speed Run */}
          <button
            onClick={() => onOpenDifficultySelect('speedrun')}
            className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/40 text-left transition-all active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-400">Par Times</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Speed Run
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Race against the clock
              </div>
            </div>
          </button>

          {/* Zen Sanctuary */}
          <button
            onClick={() => onOpenDifficultySelect('zen')}
            className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-emerald-400/40 text-left transition-all active:scale-98 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                <CloudSun className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-400">No Timer</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Zen Mode
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Pure calm, no penalties
              </div>
            </div>
          </button>
        </div>

        {/* Challenge Mode (3 Lives) full width button */}
        <button
          onClick={() => onOpenDifficultySelect('challenge')}
          className="w-full p-3.5 rounded-2xl glass-panel border border-rose-500/20 hover:border-rose-500/40 text-left transition-all active:scale-98 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Challenge Mode
              </div>
              <div className="text-[10px] text-slate-400">
                3 Strikes rule, limited hints, high score rewards
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400">3 ♥</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-500 font-mono">
          LUMORA v1.0 • Commercial Grade • Web Audio Synthesizer
        </p>
      </div>
    </div>
  );
};
