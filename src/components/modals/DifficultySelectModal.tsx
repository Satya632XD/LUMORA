import React from 'react';
import { Difficulty, GameMode } from '../../types/sudoku';
import { capitalize } from '../../utils/formatters';
import { X, Flame, Sparkles, Zap, Shield, Crown } from 'lucide-react';

interface DifficultySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
  mode: GameMode;
}

interface DifficultyOption {
  id: Difficulty;
  name: string;
  clues: string;
  description: string;
  stars: number;
  gradient: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'beginner', name: 'Beginner', clues: '48 Clues', description: 'Gentle introduction for newcomers', stars: 1, gradient: 'from-emerald-400 to-teal-500' },
  { id: 'easy', name: 'Easy', clues: '40 Clues', description: 'Casual, relaxing solving experience', stars: 2, gradient: 'from-sky-400 to-blue-500' },
  { id: 'medium', name: 'Medium', clues: '34 Clues', description: 'Balanced logic & hidden singles', stars: 3, gradient: 'from-teal-400 to-cyan-500' },
  { id: 'hard', name: 'Hard', clues: '29 Clues', description: 'Pointing pairs and line reductions', stars: 4, gradient: 'from-indigo-400 to-purple-500' },
  { id: 'expert', name: 'Expert', clues: '26 Clues', description: 'Advanced wings and candidate chaining', stars: 5, gradient: 'from-purple-400 to-pink-500' },
  { id: 'master', name: 'Master', clues: '23 Clues', description: 'Extremely challenging multi-step logic', stars: 6, gradient: 'from-amber-400 to-orange-500' },
  { id: 'grandmaster', name: 'Grandmaster', clues: '20 Clues', description: 'Elite challenge with minimal given clues', stars: 7, gradient: 'from-rose-400 to-red-600' },
];

export const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-md max-h-[90vh] rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Select Difficulty</h3>
            <p className="text-xs text-slate-400">
              Playing in <span className="text-teal-300 font-semibold">{capitalize(mode)}</span> mode
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of 7 difficulties */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff.id}
              onClick={() => {
                onSelect(diff.id);
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between gap-3 transition-all active:scale-98 group hover:border-white/25"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${diff.gradient} flex items-center justify-center text-slate-950 font-bold shadow-md`}
                >
                  {diff.id === 'grandmaster' ? (
                    <Crown className="w-5 h-5" />
                  ) : diff.id === 'master' ? (
                    <Flame className="w-5 h-5" />
                  ) : diff.id === 'expert' ? (
                    <Zap className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                      {diff.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                      {diff.clues}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    {diff.description}
                  </p>
                </div>
              </div>

              {/* Star rating indicator */}
              <div className="text-amber-400 text-xs font-mono shrink-0">
                {'★'.repeat(diff.stars)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
