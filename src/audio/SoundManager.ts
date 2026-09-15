/**
 * Browser-safe procedural Web Audio engine for Mushak Mahotsav
 * Generates authentic Indian festival percussion (dhol/tabla) & melodious chimes
 * Zero external audio assets required - instant, zero-latency, 100% reliable!
 */

export class SoundManager {
  private static instance: SoundManager | null = null;
  private ctx: AudioContext | null = null;
  private isMutedSound: boolean = false;
  private isMutedMusic: boolean = false;
  private dholTimer: number | null = null;
  private isMusicPlaying: boolean = false;
  private bpm: number = 110;
  private beatStep: number = 0;
  private isMahotsavMusic: boolean = false;

  private constructor() {
    // Lazy audio context creation on first user gesture
    const savedSound = localStorage.getItem('mushak_sound_enabled');
    const savedMusic = localStorage.getItem('mushak_music_enabled');
    this.isMutedSound = savedSound !== null ? savedSound === 'false' : false;
    this.isMutedMusic = savedMusic !== null ? savedMusic === 'false' : false;
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initOnGesture(): void {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isMutedSound = !enabled;
    localStorage.setItem('mushak_sound_enabled', String(enabled));
  }

  public setMusicEnabled(enabled: boolean): void {
    this.isMutedMusic = !enabled;
    localStorage.setItem('mushak_music_enabled', String(enabled));
    if (!enabled) {
      this.stopMusic();
    } else if (this.isMusicPlaying) {
      this.startMusic(this.isMahotsavMusic);
    }
  }

  public isSoundOn(): boolean {
    return !this.isMutedSound;
  }

  public isMusicOn(): boolean {
    return !this.isMutedMusic;
  }

  // --- SOUND EFFECTS ---

  public playJump(jumpIndex: number): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (jumpIndex === 1) {
      // Crisp springy swoosh
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.16);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (jumpIndex === 2) {
      // Double jump - sparkling rising air chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(940, t + 0.22);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.start(t);
      osc.stop(t + 0.24);

      // Harmony chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(780, t);
      osc2.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
      gain2.gain.setValueAtTime(0.15, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.2);
    } else {
      // Triple jump - triumphant aura fanfare chord
      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      freqs.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + idx * 0.03);
        g.gain.setValueAtTime(0.18, t + idx * 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + idx * 0.03);
        o.stop(t + 0.36);
      });
    }
  }

  public playCollect(type: 'modak' | 'durva' | 'flower' | 'diya'): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    if (type === 'modak') {
      // Sweet golden chime / temple bell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.06); // E6
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } else if (type === 'durva') {
      // Crisp fresh emerald flutter
      [784, 1046].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.04);
        gain.gain.setValueAtTime(0.2, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + 0.3);
      });
    } else if (type === 'flower') {
      // Warm blossoming chords
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.03);
        gain.gain.setValueAtTime(0.22, t + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.03);
        osc.stop(t + 0.42);
      });
    } else if (type === 'diya') {
      // Sacred singing bowl resonance / shield activation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.2);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.75);
    }
  }

  public playComboUp(multiplier: number): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const root = multiplier >= 8 ? 659.25 : multiplier >= 4 ? 523.25 : 440;
    const notes = [root, root * 1.25, root * 1.5, root * 2];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(0.22, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.26);
    });
  }

  public playMahotsavStart(): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Triumphant conch / trumpet fanfare
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t + i * 0.07);
      gain.gain.setValueAtTime(0.25, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + i * 0.07);
      osc.stop(t + 0.82);
    });
  }

  public playCollision(): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Resonant soft wooden thud + dust poof (respectful, wholesome, no violence)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playGameOverChime(): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Gentle uplifting temple chime chords (warm, peaceful, meditative)
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.95);
    });
  }

  public playSaveSuccess(): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Cheerful positive chime
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);
      gain.gain.setValueAtTime(0.25, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.07 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.65);
    });
  }

  public playButtonClick(): void {
    if (this.isMutedSound) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.04);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // --- FESTIVAL DHOL & RHYTHMIC AMBIENCE MUSIC LOOP ---

  public startMusic(isMahotsav: boolean = false): void {
    this.isMusicPlaying = true;
    this.isMahotsavMusic = isMahotsav;
    if (this.isMutedMusic) return;

    if (this.dholTimer !== null) {
      window.clearInterval(this.dholTimer);
      this.dholTimer = null;
    }

    this.bpm = isMahotsav ? 144 : 116;
    const intervalMs = (60 / this.bpm / 2) * 1000; // 8th notes

    this.beatStep = 0;
    this.dholTimer = window.setInterval(() => {
      this.tickFestivalBeat();
    }, intervalMs);
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.dholTimer !== null) {
      window.clearInterval(this.dholTimer);
      this.dholTimer = null;
    }
  }

  private tickFestivalBeat(): void {
    if (this.isMutedMusic) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const step = this.beatStep % 8;

    // Traditional festival dhol rhythm:
    // Step 0: Deep Bass Dhol "Dha"
    // Step 2: High Slap "Ta"
    // Step 4: Bass Dhol + Accent
    // Step 6: Rapid Double Slap "Ti-Ri"
    // In Mahotsav mode: extra brass bell and faster pulse!

    if (step === 0 || step === 4) {
      this.playDholBass(t, step === 0 ? 0.28 : 0.22);
    } else if (step === 2 || step === 6) {
      this.playDholSlap(t, 0.16);
    }

    // High manjira / bronze temple chime accent
    if (step === 0 || step === 2 || step === 4 || step === 6) {
      this.playManjiraChime(t, 0.04);
    }

    if (this.isMahotsavMusic && (step === 1 || step === 5)) {
      this.playDholSlap(t + 0.05, 0.1);
      this.playManjiraChime(t + 0.05, 0.06);
    }

    this.beatStep++;
  }

  private playDholBass(t: number, volume: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.18);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }

  private playDholSlap(t: number, volume: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  private playManjiraChime(t: number, volume: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2489, t); // D#7 high metallic shimmer
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }
}
