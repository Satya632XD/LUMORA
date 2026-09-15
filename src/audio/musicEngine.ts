/**
 * Procedural Generative Ambient Music Engine.
 * Creates tranquil background soundscapes using polyphonic multi-oscillator pads
 * and periodic meditative pentatonic bell/piano melodies.
 */

class MusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private enabled: boolean = true;
  private volume: number = 0.4;
  private intervalId: number | null = null;

  // Calm Pentatonic Scale frequencies (F# Minor / A Major pentatonic: F#3, A3, B3, C#4, E4, F#4, A4, B4, C#5)
  private MELODY_PITCHES = [
    185.00, // F#3
    220.00, // A3
    246.94, // B3
    277.18, // C#4
    329.63, // E4
    369.99, // F#4
    440.00, // A4
    493.88, // B4
    554.37  // C#5
  ];

  // Ambient Drone Chord Frequencies
  private DRONE_FREQUENCIES = [
    92.50,  // F#2 root
    138.59, // C#3 fifth
    220.00, // A3 minor third
    277.18  // C#4 fifth octave
  ];

  private droneOscillators: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume * (this.enabled ? 1 : 0), this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const target = this.enabled ? this.volume : 0;
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.masterGain && this.ctx) {
      const target = this.enabled ? this.volume : 0;
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.3);
    }
    if (enabled && !this.isPlaying) {
      this.start();
    } else if (!enabled && this.isPlaying) {
      this.stop();
    }
  }

  public start() {
    if (this.isPlaying || !this.enabled) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Start lush background ambient drone pads
    this.droneOscillators = [];
    this.droneGains = [];

    this.DRONE_FREQUENCIES.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle lowpass filter to make it mellow and warm
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380 + idx * 80, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      this.droneOscillators.push(osc);
      this.droneGains.push(gain);
    });

    // Schedule gentle, spaced out pentatonic bell notes
    const scheduleNextNote = () => {
      if (!this.isPlaying) return;
      this.playGentlePluck();
      // Wait between 2.4s and 4.8s for slow meditative rhythm
      const delay = 2400 + Math.random() * 2400;
      this.intervalId = window.setTimeout(scheduleNextNote, delay);
    };

    this.intervalId = window.setTimeout(scheduleNextNote, 1500);
  }

  private playGentlePluck() {
    if (!this.ctx || !this.masterGain || !this.enabled) return;

    const pitch = this.MELODY_PITCHES[Math.floor(Math.random() * this.MELODY_PITCHES.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGains.forEach(g => {
        try {
          g.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        } catch {
          // Ignore ramp error
        }
      });
      setTimeout(() => {
        this.droneOscillators.forEach(o => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // Ignore
          }
        });
        this.droneOscillators = [];
        this.droneGains = [];
      }, 1300);
    }
  }
}

export const musicEngine = new MusicEngine();
