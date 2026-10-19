class AudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.chordIndex = 0;
    this.listeners = new Set();
    this.bgAudio = null;
    this.hasBgFile = false;

    // Sweet romantic melody chords (vintage music box / Canon vibe)
    this.melodyPhrases = [
      { notes: [261.63, 329.63, 392.00, 523.25], delays: [0, 0.28, 0.56, 0.84] }, // C Major
      { notes: [196.00, 293.66, 392.00, 493.88], delays: [0, 0.28, 0.56, 0.84] }, // G Major
      { notes: [220.00, 261.63, 329.63, 440.00], delays: [0, 0.28, 0.56, 0.84] }, // A Minor
      { notes: [164.81, 246.94, 329.63, 392.00], delays: [0, 0.28, 0.56, 0.84] }, // E Minor
      { notes: [174.61, 220.00, 261.63, 349.23], delays: [0, 0.28, 0.56, 0.84] }, // F Major
      { notes: [261.63, 329.63, 392.00, 523.25], delays: [0, 0.28, 0.56, 0.84] }, // C Major
      { notes: [174.61, 220.00, 293.66, 349.23], delays: [0, 0.28, 0.56, 0.84] }, // Dm / F
      { notes: [196.00, 246.94, 293.66, 392.00], delays: [0, 0.28, 0.56, 0.84] }  // G Major
    ];

    this.userPaused = false;

    if (typeof window !== 'undefined') {
      this.initBgAudio();
    }
  }

  initBgAudio() {
    try {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.bgAudio = audio;
        this.hasBgFile = true;
      }, { once: true });

      audio.addEventListener('error', () => {
        this.bgAudio = null;
        this.hasBgFile = false;
      }, { once: true });

      // Check for user-placed mp3 in public/
      audio.src = '/bgm.mp3';
    } catch (e) {
      this.hasBgFile = false;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying);
      } catch (e) {}
    });
  }

  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playKeyBeep(frequency = 440) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playSuccess() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  playError() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(175, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playMusicBoxNote(freq, startTime, duration = 2.4, volume = 0.045) {
    try {
      const ctx = this.getContext();

      // Fundamental tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);
      gain1.gain.setValueAtTime(volume, startTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(startTime);
      osc1.stop(startTime + duration + 0.1);

      // Subtle sparkle harmonic (bell-like character)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);
      gain2.gain.setValueAtTime(volume * 0.35, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.55));
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(startTime);
      osc2.stop(startTime + duration + 0.1);
    } catch (e) {}
  }

  startMusic(onStateChange, isUserAction = false) {
    if (isUserAction) {
      this.userPaused = false;
    }
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.notify();
    if (onStateChange) onStateChange(true);

    try {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}

    if (this.bgAudio && this.hasBgFile) {
      this.bgAudio.currentTime = 0;
      const playPromise = this.bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.startSynthMelody();
        });
      }
      return;
    }

    this.startSynthMelody();
  }

  startSynthMelody() {
    const playStep = () => {
      if (!this.isPlaying) return;
      const ctx = this.getContext();
      const phrase = this.melodyPhrases[this.chordIndex % this.melodyPhrases.length];
      this.chordIndex++;

      const now = ctx.currentTime;
      phrase.notes.forEach((freq, idx) => {
        const delay = phrase.delays[idx] || (idx * 0.28);
        this.playMusicBoxNote(freq, now + delay, 2.4, 0.042);
      });

      this.timer = setTimeout(playStep, 2400);
    };

    playStep();
  }

  stopMusic(onStateChange, isUserAction = false) {
    if (isUserAction) {
      this.userPaused = true;
    }
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
      } catch (e) {}
    }
    this.notify();
    if (onStateChange) onStateChange(false);
  }

  toggleMusic(onStateChange) {
    if (this.isPlaying) {
      this.stopMusic(onStateChange, true);
    } else {
      this.startMusic(onStateChange, true);
    }
  }
}

export const audioService = new AudioManager();
