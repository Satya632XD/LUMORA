import React, { useState } from 'react';
import { useProfile } from '../../store/profileStore';
import { getTodayDateString, getDaysInMonth, getFirstDayOfMonth } from '../../utils/dailySeed';
import { Calendar, ChevronLeft, ChevronRight, X, Flame, Award, Play } from 'lucide-react';

interface DailyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayDaily: (dateStr: string) => void;
}

export const DailyCalendarModal: React.FC<DailyCalendarModalProps> = ({
  isOpen,
  onClose,
  onPlayDaily,
}) => {
  const profile = useProfile();
  const todayStr = getTodayDateString();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Month completion count
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthCompletedCount = profile.completedDailyDates.filter(d => d.startsWith(monthPrefix)).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Challenges</h3>
              <p className="text-xs text-slate-400">One unique puzzle every day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streaks Card */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Streak</div>
              <div className="text-base font-bold font-mono text-white">
                {profile.currentStreak} Days
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">This Month</div>
              <div className="text-base font-bold font-mono text-white">
                {monthCompletedCount}/{daysInMonth}
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white tracking-wide">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-5">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-[11px] font-semibold text-slate-400 py-1">
              {d}
            </div>
          ))}

          {/* Empty prefix cells */}
          {Array.from({ length: firstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}

          {/* Day numbers */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const isCompleted = profile.completedDailyDates.includes(dateStr);
            const isToday = dateStr === todayStr;
            const isFuture = new Date(dateStr) > new Date(todayStr);

            return (
              <button
                key={dayNum}
                disabled={isFuture}
                onClick={() => {
                  onPlayDaily(dateStr);
                  onClose();
                }}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                    : isToday
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : isFuture
                    ? 'opacity-20 pointer-events-none text-slate-600'
                    : 'hover:bg-white/10 text-slate-200 border border-white/5'
                }`}
              >
                <span>{dayNum}</span>
                {isCompleted && (
                  <span className="text-[9px] leading-none text-teal-300">★</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Start Today's Challenge */}
        <button
          onClick={() => {
            onPlayDaily(todayStr);
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Play Today's Daily Puzzle</span>
        </button>
      </div>
    </div>
  );
};
