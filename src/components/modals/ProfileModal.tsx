import React from 'react';
import { useProfile, xpForNextLevel, RANKS } from '../../store/profileStore';
import { formatTime, formatNumber, capitalize } from '../../utils/formatters';
import { Difficulty } from '../../types/sudoku';
import { X, User, Trophy, Flame, Clock, Award, Target, Zap } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const profile = useProfile();

  if (!isOpen) return null;

  const reqXP = xpForNextLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / reqXP) * 100));
  const rankConfig = RANKS.find(r => r.title === profile.rank) || RANKS[0];

  const winRate =
    profile.gamesPlayed > 0
      ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100)
      : 0;

  const avgSolveTime =
    profile.gamesWon > 0
      ? Math.round(profile.totalTimePlayed / profile.gamesWon)
      : 0;

  const difficulties: Difficulty[] = [
    'beginner', 'easy', 'medium', 'hard', 'expert', 'master', 'grandmaster'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Player Profile</h3>
              <p className="text-xs text-slate-400">Progression & Lifetime Statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rank & Level Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
            {rankConfig.badge}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-bold text-white">{profile.rank}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Tier {rankConfig.tier} of 8
              </span>
            </div>
            <div className="text-xs text-slate-400 mb-2">
              Level {profile.level} • {formatNumber(profile.xp)} / {formatNumber(reqXP)} XP
            </div>
            {/* Level Bar */}
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Wins</div>
            <div className="text-base font-bold font-mono text-white">
              {profile.gamesWon} / {profile.gamesPlayed}
            </div>
            <div className="text-[10px] text-teal-400 mt-0.5">{winRate}% Win Rate</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Flame className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Daily Streak</div>
            <div className="text-base font-bold font-mono text-white">
              {profile.currentStreak} Days
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Best: {profile.bestStreak}d</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Avg Solve</div>
            <div className="text-base font-bold font-mono text-white">
              {formatTime(avgSolveTime)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Total: {Math.round(profile.totalTimePlayed / 60)}m
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <Target className="w-4 h-4 text-teal-300" />
            <div>
              <div className="text-xs text-slate-400">Endless Record</div>
              <div className="text-sm font-bold font-mono text-white">
                {profile.bestEndlessStreak} Puzzles
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-purple-300" />
            <div>
              <div className="text-xs text-slate-400">Notes Taken</div>
              <div className="text-sm font-bold font-mono text-white">
                {formatNumber(profile.totalNotesPlaced)}
              </div>
            </div>
          </div>
        </div>

        {/* Fastest Times by Difficulty */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Fastest Records by Difficulty
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {difficulties.map(diff => {
            const time = profile.fastestTimes[diff];
            return (
              <div
                key={diff}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-200">{capitalize(diff)}</span>
                <span className="font-mono text-teal-300 font-bold">
                  {time !== null ? formatTime(time) : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
