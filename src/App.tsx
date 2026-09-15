import React, { useState } from 'react';
import { useSettings } from './store/settingsStore';
import { useGameStore, gameStore } from './store/gameStore';
import { GameMode, Difficulty } from './types/sudoku';
import { ParticleBackground } from './components/visual/ParticleBackground';
import { MainMenu } from './components/navigation/MainMenu';
import { GameHeader } from './components/hud/GameHeader';
import { SudokuBoard } from './components/board/SudokuBoard';
import { ControlBar } from './components/board/ControlBar';
import { Keypad } from './components/board/Keypad';
import { VictoryModal } from './components/modals/VictoryModal';
import { HintModal } from './components/modals/HintModal';
import { GameOverModal } from './components/modals/GameOverModal';
import { DailyCalendarModal } from './components/modals/DailyCalendarModal';
import { DifficultySelectModal } from './components/modals/DifficultySelectModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AchievementToast } from './components/hud/AchievementToast';

export const App: React.FC = () => {
  const [settings] = useSettings();
  const gameState = useGameStore();

  const [currentScreen, setCurrentScreen] = useState<'menu' | 'playing'>('menu');

  // Modal dialog states
  const [difficultyModalMode, setDifficultyModalMode] = useState<GameMode | null>(null);
  const [isDailyCalendarOpen, setIsDailyCalendarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Start game handler
  const handleStartGame = (mode: GameMode, difficulty: Difficulty = 'medium', seed?: string) => {
    gameStore.startNewGame(difficulty, mode, seed);
    setCurrentScreen('playing');
  };

  const handleOpenDifficultySelect = (mode: GameMode) => {
    setDifficultyModalMode(mode);
  };

  const handleDifficultySelected = (difficulty: Difficulty) => {
    if (difficultyModalMode) {
      handleStartGame(difficultyModalMode, difficulty);
      setDifficultyModalMode(null);
    }
  };

  return (
    <div
      className={`relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden ${
        settings.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Animated Visual Canvas Particle Background */}
      <ParticleBackground
        theme={settings.theme}
        animationLevel={settings.animationLevel}
      />

      {/* Real-time Achievement Toast */}
      <AchievementToast />

      {/* Active Screen */}
      {currentScreen === 'menu' ? (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenDifficultySelect={handleOpenDifficultySelect}
          onOpenDailyCalendar={() => setIsDailyCalendarOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        /* Playing Screen */
        <main className="relative z-10 w-full h-full flex flex-col justify-between max-w-lg mx-auto py-1 sm:py-2 px-2 overflow-hidden">
          {/* Top HUD Header */}
          <GameHeader
            onBackToMenu={() => setCurrentScreen('menu')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />

          {/* 9x9 Sudoku Board */}
          <div className="flex-1 flex items-center justify-center my-auto min-h-0 py-1">
            <SudokuBoard />
          </div>

          {/* Action Control Bar (Undo, Redo, Erase, Notes, Auto, Hint) */}
          <ControlBar />

          {/* 1-9 Keypad */}
          <Keypad />

          {/* In-Game Interactive Modals */}
          <HintModal />
          <VictoryModal
            onNextPuzzle={() => gameStore.startNewGame(gameState.difficulty, gameState.mode)}
            onBackToMenu={() => setCurrentScreen('menu')}
          />
          <GameOverModal onBackToMenu={() => setCurrentScreen('menu')} />
        </main>
      )}

      {/* Global Modals */}
      <DifficultySelectModal
        isOpen={difficultyModalMode !== null}
        mode={difficultyModalMode || 'classic'}
        onClose={() => setDifficultyModalMode(null)}
        onSelect={handleDifficultySelected}
      />

      <DailyCalendarModal
        isOpen={isDailyCalendarOpen}
        onClose={() => setIsDailyCalendarOpen(false)}
        onPlayDaily={(dateStr) => handleStartGame('daily', 'medium', dateStr)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
