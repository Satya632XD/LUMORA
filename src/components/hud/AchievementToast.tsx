import React, { useEffect } from 'react';
import { useAchievements } from '../../store/achievementStore';
import { Award, Sparkles, X } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const { recentUnlock, clearRecentUnlock } = useAchievements();

  useEffect(() => {
    if (!recentUnlock) return;
    const timer = setTimeout(() => {
      clearRecentUnlock();
    }, 4500);
    return () => clearTimeout(timer);
  }, [recentUnlock, clearRecentUnlock]);

  if (!recentUnlock) return null;

  return (
    <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 animate-pop-number">
      <div className="p-3.5 rounded-2xl glass-panel border border-amber-400/40 shadow-2xl bg-slate-900/95 backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Achievement Unlocked!
            </span>
            <span className="text-[10px] font-semibold text-teal-300 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />+{recentUnlock.xpReward} XP
            </span>
          </div>
          <h4 className="text-sm font-bold text-white truncate">
            {recentUnlock.title}
          </h4>
          <p className="text-[11px] text-slate-300 truncate">
            {recentUnlock.description}
          </p>
        </div>

        <button
          onClick={clearRecentUnlock}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
