import React from 'react';
import { useSettings } from '../../store/settingsStore';
import {
  ThemeId,
  CellStyleId,
  FontFamilyId,
  AnimationLevel,
  ColorblindMode,
} from '../../types/sudoku';
import {
  X,
  Sliders,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  Sparkles,
  Smartphone,
  Type,
  LayoutGrid,
} from 'lucide-react';
import { updateAchievementProgress } from '../../store/achievementStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, updateSettings] = useSettings();

  if (!isOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; color: string }[] = [
    { id: 'aurora', name: 'Aurora', desc: 'Northern lights & ethereal teal glow', color: 'from-teal-400 to-sky-500' },
    { id: 'crystal', name: 'Crystal', desc: 'Prismatic frost & violet refraction', color: 'from-cyan-300 to-purple-400' },
    { id: 'midnight', name: 'Midnight', desc: 'Deep cosmos & starry indigo calm', color: 'from-indigo-400 to-slate-900' },
    { id: 'zen', name: 'Zen', desc: 'Bamboo green & falling blossom petals', color: 'from-emerald-400 to-amber-600' },
    { id: 'royal', name: 'Royal', desc: 'Imperial sapphire & gilded gold luxury', color: 'from-amber-400 to-rose-500' },
  ];

  const cellStyles: { id: CellStyleId; label: string }[] = [
    { id: 'neo-glass', label: 'Neo Glass' },
    { id: 'clean-slate', label: 'Clean Slate' },
    { id: 'golden-aura', label: 'Golden Aura' },
    { id: 'high-contrast', label: 'High Contrast' },
  ];

  const fonts: { id: FontFamilyId; label: string; preview: string }[] = [
    { id: 'outfit', label: 'Modern Sans', preview: 'font-sans' },
    { id: 'playfair', label: 'Luxury Serif', preview: 'font-serif' },
    { id: 'jetbrains', label: 'Tech Mono', preview: 'font-mono' },
  ];

  const animLevels: { id: AnimationLevel; label: string }[] = [
    { id: 'full', label: 'Full' },
    { id: 'medium', label: 'Medium' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'off', label: 'Off' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-pop-number">
      <div className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Settings & Visuals</h3>
              <p className="text-xs text-slate-400">Personalize themes, audio & accessibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
            <Palette className="w-3.5 h-3.5 text-teal-400" />
            <span>Visual Themes</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  updateSettings({ theme: t.id });
                  updateAchievementProgress(`theme_${t.id}`, 1);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  settings.theme === t.id
                    ? 'bg-white/15 border-white/40 ring-2 ring-teal-400 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${t.color} shrink-0 shadow-sm`}
                />
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Cell Styles & Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
              <span>Cell Style</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {cellStyles.map(cs => (
                <button
                  key={cs.id}
                  onClick={() => {
                    updateSettings({ cellStyle: cs.id });
                    updateAchievementProgress('change_cell_style', 1);
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    settings.cellStyle === cs.id
                      ? 'bg-teal-500 text-slate-950 font-bold border-transparent'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cs.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Type className="w-3.5 h-3.5 text-teal-400" />
              <span>Font Family</span>
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {fonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    updateSettings({ font: f.id });
                    updateAchievementProgress('change_font_family', 1);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center text-xs font-medium transition-all ${f.preview} ${
                    settings.font === f.id
                      ? 'bg-teal-500 text-slate-950 font-bold border-transparent'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Audio (SFX & Ambient Music) */}
        <div className="mb-5 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Procedural Audio Experience</span>
          </h4>

          {/* Sound FX */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSettings({ sfxEnabled: !settings.sfxEnabled })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200"
              >
                {settings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <span className="text-xs text-slate-200 font-medium">Sound Effects</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              onChange={e => updateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-32 accent-teal-400"
            />
          </div>

          {/* Generative Music */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200"
              >
                {settings.musicEnabled ? <Sparkles className="w-4 h-4 text-teal-300" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <div>
                <span className="text-xs text-slate-200 font-medium">Ambient Music</span>
                <span className="text-[10px] text-slate-400 block leading-tight">Generative Zen soundscape</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={e => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-32 accent-teal-400"
            />
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Haptic Vibration (Mobile)</span>
            </span>
            <input
              type="checkbox"
              checked={settings.hapticsEnabled}
              onChange={e => updateSettings({ hapticsEnabled: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </div>
        </div>

        {/* Section 4: Gameplay Helpers & Input Mode */}
        <div className="mb-5 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <span>Solving Assistance</span>
          </h4>

          {/* Input Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div>
              <span className="font-semibold text-white">Input Mode</span>
              <span className="text-[10px] text-slate-400 block">
                {settings.inputMode === 'cell-first'
                  ? 'Cell-First (Select cell, tap number)'
                  : 'Digit-First (Select digit brush, tap cells)'}
              </span>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  inputMode: settings.inputMode === 'cell-first' ? 'digit-first' : 'cell-first',
                })
              }
              className="px-3 py-1 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 font-semibold"
            >
              {settings.inputMode === 'cell-first' ? 'Cell-First' : 'Digit-First'}
            </button>
          </div>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Highlight same number across board</span>
            <input
              type="checkbox"
              checked={settings.highlightSelectedNumber}
              onChange={e => updateSettings({ highlightSelectedNumber: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Highlight active row, column & 3×3 box</span>
            <input
              type="checkbox"
              checked={settings.highlightRegion}
              onChange={e => updateSettings({ highlightRegion: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Highlight conflicting duplicates (Errors)</span>
            <input
              type="checkbox"
              checked={settings.highlightDuplicates}
              onChange={e => updateSettings({ highlightDuplicates: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Auto-remove pencil notes when digit placed</span>
            <input
              type="checkbox"
              checked={settings.autoRemoveNotes}
              onChange={e => updateSettings({ autoRemoveNotes: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Show remaining count badges on keypad</span>
            <input
              type="checkbox"
              checked={settings.showRemainingCounts}
              onChange={e => updateSettings({ showRemainingCounts: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>
        </div>

        {/* Section 5: Accessibility */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>Accessibility & Motion</span>
          </h4>

          {/* Animation Level */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-200">Particle Animations</span>
            <div className="flex gap-1">
              {animLevels.map(a => (
                <button
                  key={a.id}
                  onClick={() => updateSettings({ animationLevel: a.id })}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    settings.animationLevel === a.id
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">Large Numbers / Bold Mode</span>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={e => updateSettings({ largeText: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer">
            <span className="text-slate-200">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={e => updateSettings({ highContrast: e.target.checked })}
              className="w-4 h-4 accent-teal-400 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
