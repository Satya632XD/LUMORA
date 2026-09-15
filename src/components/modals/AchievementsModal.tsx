import React, { useState } from 'react';
import { useAchievements } from '../../store/achievementStore';
import { AchievementCategory } from '../../types/sudoku';
import { Trophy, X, CheckCircle, Lock, Award, Sparkles } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { achievements } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentUnlocked = Math.round((unlockedCount / totalCount) * 100);

  const categories: { id: AchievementCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'difficulties', label: 'Difficulty' },
    { id: 'speed', label: 'Speed' },
    { id: 'perfection', label: 'Perfection' },
    { id: 'streaks', label: 'Streaks' },
    { id: 'tactics', label: 'Tactics' },
    { id: 'mastery', label: 'Mastery' },
  ];

  const filtered = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-xl max-h-[90vh] rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Achievements</h3>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {totalCount} ({percentUnlocked}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-300"
            style={{ width: `${percentUnlocked}%` }}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map(item => {
            const isDone = item.unlocked;
            const progressRatio = Math.min(100, Math.round((item.progress / item.maxProgress) * 100));

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isDone
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'bg-white/5 border-white/10 opacity-75'
                }`}
              >
                {/* Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    isDone
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isDone ? 'text-amber-300' : 'text-slate-200'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-teal-300 shrink-0 flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" />
                      +{item.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight line-clamp-2 mt-0.5">
                    {item.description}
                  </p>

                  {/* Progress bar if multi-step */}
                  {item.maxProgress > 1 && !isDone && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-400 rounded-full"
                          style={{ width: `${progressRatio}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.progress}/{item.maxProgress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
