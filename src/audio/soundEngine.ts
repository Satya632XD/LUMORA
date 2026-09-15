/**
 * Procedural Web Audio API Sound Synthesizer.
 * Provides rich, zero-latency, harmonically tuned sound effects without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.7;
  private enabled: boolean = true;
  private hapticsEnabled: boolean = true;

  private PENTATONIC_PITCHES: number[] = [
    523.25, // 1: C5
    587.33, // 2: D5
    659.25, // 3: E5
    783.99, // 4: G5
    880.00, // 5: A5
    1046.50, // 6: C6
    1174.66, // 7: D6
    1318.51, // 8: E6
    1567.98, // 9: G6
  ];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public setHaptics(val: boolean) {
    this.hapticsEnabled = val;
  }

  private triggerHaptic(pattern: number | number[]) {
    if (this.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptics failure if unsupported or blocked
      }
    }
  }

  /**
   * Plays harmonic bell chime when a number (1-9) is placed.
   */
  public playNumberPlaced(num: number) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic(12);

    const freq = this.PENTATONIC_PITCHES[(num - 1) % 9] || 659.25;
    const now = this.ctx.currentTime;

    // Fundamental oscillator (triangle/sine blend for warm bell chime)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Overtone oscillator for sparkling sheen
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.756, now); // Metallic partial

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28 * this.volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.01);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(this.ctx.destination);
    overtoneGain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.6);
    overtone.stop(now + 0.3);
  }

  /**
   * Tactile soft click for cell selection.
   */
  public playCellSelect() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic(6);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

    gain.gain.setValueAtTime(0.08 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Soft pencil scratch for note mode entry.
   */
  public playPencilTick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic(8);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

    gain.gain.setValueAtTime(0.06 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Gentle soft marimba thud for mistakes.
   */
  public playMistake() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic([30, 40, 30]);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

    // Filter to soften harshness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  /**
   * Airy swoosh for eraser and undo.
   */
  public playErase() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic(10);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    gain.gain.setValueAtTime(0.12 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Celestial chime when a row, column, or 3x3 box is completed.
   */
  public playLineComplete() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic([20, 30, 20]);

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  /**
   * Grand victory arpeggio sequence upon solving puzzle.
   */
  public playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic([40, 60, 40, 60, 100]);

    const now = this.ctx.currentTime;
    // Major 9th ascending cascade: C5, E5, G5, B5, D6, E6, G6, C7
    const fanfareNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98, 2093.00];

    fanfareNotes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  /**
   * Soft sparkling chime when hint is shown.
   */
  public playHint() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.triggerHaptic(15);

    const now = this.ctx.currentTime;
    const notes = [880, 1174.66, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14 * this.volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }
}

export const soundEngine = new SoundEngine();
