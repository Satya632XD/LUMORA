import { useState, useEffect } from 'react';
import { GameSettings } from '../types/sudoku';
import { storage } from '../utils/storage';
import { soundEngine } from '../audio/soundEngine';
import { musicEngine } from '../audio/musicEngine';

const SETTINGS_KEY = 'settings';

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'aurora',
  cellStyle: 'neo-glass',
  font: 'outfit',
  animationLevel: 'full',
  soundVolume: 0.7,
  musicVolume: 0.4,
  sfxEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  highlightDuplicates: true,
  highlightSelectedNumber: true,
  highlightRegion: true,
  autoRemoveNotes: true,
  showRemainingCounts: true,
  mistakesLimit: false,
  inputMode: 'cell-first',
  colorblindMode: 'none',
  highContrast: false,
  largeText: false,
};

let currentSettings: GameSettings = storage.getItem<GameSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);

// Sync engines initially
soundEngine.setVolume(currentSettings.soundVolume);
soundEngine.setEnabled(currentSettings.sfxEnabled);
soundEngine.setHaptics(currentSettings.hapticsEnabled);
musicEngine.setVolume(currentSettings.musicVolume);
musicEngine.setEnabled(currentSettings.musicEnabled);

type SettingsListener = (settings: GameSettings) => void;
const listeners = new Set<SettingsListener>();

export function getSettings(): GameSettings {
  return currentSettings;
}

export function updateSettings(partial: Partial<GameSettings>): void {
  currentSettings = { ...currentSettings, ...partial };
  storage.setItem(SETTINGS_KEY, currentSettings);

  // Sync Audio Engines
  if (partial.soundVolume !== undefined) soundEngine.setVolume(partial.soundVolume);
  if (partial.sfxEnabled !== undefined) soundEngine.setEnabled(partial.sfxEnabled);
  if (partial.hapticsEnabled !== undefined) soundEngine.setHaptics(partial.hapticsEnabled);
  if (partial.musicVolume !== undefined) musicEngine.setVolume(partial.musicVolume);
  if (partial.musicEnabled !== undefined) musicEngine.setEnabled(partial.musicEnabled);

  // Notify active components
  listeners.forEach(fn => fn(currentSettings));
}

export function useSettings(): [GameSettings, (partial: Partial<GameSettings>) => void] {
  const [settings, setSettings] = useState<GameSettings>(currentSettings);

  useEffect(() => {
    const handleUpdate = (updated: GameSettings) => setSettings(updated);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return [settings, updateSettings];
}
