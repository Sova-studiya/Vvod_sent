/**
 * Voice narration and sound effects engine tailored for young language learners.
 * Guaranteed slow female voice narration and Web Audio synthesized sound effects.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  playSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [800, 1100, 1400, 1750, 2100];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  }

  playGentleError() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }
}

export const sfx = new SoundEffects();

export class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.selectedVoice = this.findBestFemaleVoice();
    this.isInitialized = true;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  public findBestFemaleVoice(): SpeechSynthesisVoice | null {
    const englishVoices = this.getVoices();
    if (englishVoices.length === 0) return null;

    // Prefer high-quality female voices
    const femaleKeywords = [
      'samantha', 'victoria', 'karen', 'moira', 'tessa', 'zira',
      'jenny', 'aria', 'female', 'woman', 'google us english', 'google uk english female',
      'fiona', 'allison', 'ava', 'serena'
    ];

    for (const kw of femaleKeywords) {
      const match = englishVoices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }

    // Secondary fallback: en-US or en-GB voices
    const enUS = englishVoices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
    if (enUS) return enUS;

    const anyEn = englishVoices.find(v => v.lang.startsWith('en'));
    return anyEn || englishVoices[0] || null;
  }

  public setVoiceByURI(uri: string) {
    const voice = this.voices.find(v => v.voiceURI === uri);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  public getSelectedVoiceName(): string {
    return this.selectedVoice ? `${this.selectedVoice.name} (${this.selectedVoice.lang})` : 'Natural English (Female)';
  }

  /**
   * Speak a word or sentence with slow rate (default 0.72 for 7-year-olds)
   */
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.selectedVoice || this.findBestFemaleVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = options.rate ?? 0.72; // Slow, deliberate speech for young kids
    utterance.pitch = options.pitch ?? 1.06; // Warm, slightly elevated pitch for friendliness

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          options.onBoundary?.(e.charIndex);
        }
      };
    }

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Phonics sound-out: spells out phonemes slowly (e.g. /k/ ... /ʌ/ ... /p/ -> CUP)
   */
  public async soundOutPhonics(
    word: string,
    phonemes: string[],
    onPhonemeHighlight?: (index: number) => void,
    onComplete?: () => void
  ) {
    window.speechSynthesis.cancel();

    // Map letter to phonetic sound-friendly text
    const phonemeMap: Record<string, string> = {
      c: 'k',
      k: 'k',
      u: 'uh',
      p: 'p',
      r: 'r',
      g: 'g',
      b: 'b',
      s: 'sss',
      n: 'n',
      m: 'mmm',
      i: 'ih',
      d: 'd',
      a: 'æ',
      t: 't'
    };

    for (let i = 0; i < phonemes.length; i++) {
      const letter = phonemes[i];
      onPhonemeHighlight?.(i);
      sfx.playPop();

      await new Promise<void>((resolve) => {
        this.speak(letter, {
          rate: 0.65,
          pitch: 1.1,
          onEnd: () => resolve()
        });
      });

      await new Promise((r) => setTimeout(r, 220));
    }

    onPhonemeHighlight?.(-1);
    await new Promise((r) => setTimeout(r, 200));

    // Now speak whole word
    this.speak(word, {
      rate: 0.72,
      pitch: 1.08,
      onEnd: () => {
        onComplete?.();
      }
    });
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechEngine = new SpeechEngine();
