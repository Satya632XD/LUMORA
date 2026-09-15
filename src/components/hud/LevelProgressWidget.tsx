import React from 'react';
import { useProfile, xpForNextLevel, RANKS } from '../../store/profileStore';
import { Sparkles } from 'lucide-react';

interface LevelProgressWidgetProps {
  onOpenProfile: () => void;
}

export const LevelProgressWidget: React.FC<LevelProgressWidgetProps> = ({ onOpenProfile }) => {
  const profile = useProfile();
  const reqXP = xpForNextLevel(profile.level);
  const percent = Math.min(100, Math.round((profile.xp / reqXP) * 100));

  const rankConfig = RANKS.find(r => r.title === profile.rank) || RANKS[0];

  return (
    <button
      onClick={onOpenProfile}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95 group text-left cursor-pointer"
      aria-label="View Player Profile"
    >
      <div className="text-base leading-none">{rankConfig.badge}</div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
          <span>{profile.rank}</span>
          <span className="text-slate-400 font-normal">Lvl {profile.level}</span>
        </div>
        {/* XP Bar */}
        <div className="w-20 sm:w-28 h-1.5 bg-black/40 rounded-full overflow-hidden mt-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-sky-400 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <Sparkles className="w-3.5 h-3.5 text-teal-300 opacity-60 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
