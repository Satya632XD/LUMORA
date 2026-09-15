import React, { useState } from 'react';
import { useProfile } from '../../store/profileStore';
import { Difficulty, GameMode, LeaderboardEntry } from '../../types/sudoku';
import { formatTime, formatNumber, capitalize } from '../../utils/formatters';
import { Trophy, X, Globe, UserCheck, Medal, Clock } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simulated realistic global elite competitors
const GLOBAL_PLAYERS: LeaderboardEntry[] = [
  { id: '1', playerName: 'Elena_V', score: 14250, timeSeconds: 114, difficulty: 'medium', mode: 'classic', rankTitle: 'Luminary', country: 'SE', date: 'Today' },
  { id: '2', playerName: 'Kaito_Logic', score: 13800, timeSeconds: 129, difficulty: 'medium', mode: 'classic', rankTitle: 'Grandmaster', country: 'JP', date: 'Today' },
  { id: '3', playerName: 'Marcus_Reid', score: 12950, timeSeconds: 142, difficulty: 'medium', mode: 'classic', rankTitle: 'Master', country: 'CA', date: 'Today' },
  { id: '4', playerName: 'Sophia_Z', score: 11800, timeSeconds: 158, difficulty: 'medium', mode: 'classic', rankTitle: 'Expert', country: 'DE', date: 'Yesterday' },
  { id: '5', playerName: 'Alexandre_B', score: 10920, timeSeconds: 175, difficulty: 'medium', mode: 'classic', rankTitle: 'Expert', country: 'FR', date: 'Yesterday' },
  { id: '6', playerName: 'Aarav_P', score: 9840, timeSeconds: 188, difficulty: 'medium', mode: 'classic', rankTitle: 'Analyst', country: 'IN', date: '2d ago' },
  { id: '7', playerName: 'Clara_M', score: 9100, timeSeconds: 205, difficulty: 'medium', mode: 'classic', rankTitle: 'Strategist', country: 'BR', date: '3d ago' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const profile = useProfile();
  const [activeTab, setActiveTab] = useState<'global' | 'local'>('global');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  if (!isOpen) return null;

  const userFastest = profile.fastestTimes[selectedDifficulty];
  const userBestScore = profile.bestScores.classic || 8500;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Leaderboards</h3>
              <p className="text-xs text-slate-400">Top rankings & personal bests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Global vs Personal */}
        <div className="flex p-1 bg-black/30 rounded-2xl mb-3 border border-white/10">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'global'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Global Hall of Fame</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'local'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>My Records</span>
          </button>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {(['beginner', 'easy', 'medium', 'hard', 'expert', 'master', 'grandmaster'] as Difficulty[]).map(
            diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {capitalize(diff)}
              </button>
            )
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
          {activeTab === 'global' ? (
            GLOBAL_PLAYERS.map((player, idx) => {
              const rankMedal =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <div
                  key={player.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold font-mono">
                      {rankMedal}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{player.playerName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {player.country}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{player.rankTitle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-teal-300 text-sm">
                      {formatTime(player.timeSeconds)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatNumber(player.score)} pts
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Local Records */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 to-sky-500/15 border border-teal-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Fastest Solve ({capitalize(selectedDifficulty)})</div>
                  <div className="text-2xl font-bold font-mono text-teal-300 mt-0.5">
                    {userFastest ? formatTime(userFastest) : 'No time recorded yet'}
                  </div>
                </div>
                <Clock className="w-8 h-8 text-teal-300/40" />
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">High Score</div>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                    {formatNumber(userBestScore)}
                  </div>
                </div>
                <Medal className="w-8 h-8 text-amber-300/40" />
              </div>
            </div>
          )}
        </div>

        {/* User rank footer if global */}
        {activeTab === 'global' && (
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-teal-300">Your Rank</span>
              <span className="font-semibold text-white">You ({profile.rank})</span>
            </div>
            <div className="font-mono font-bold text-teal-300">
              {userFastest ? formatTime(userFastest) : '—'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
