// Procedural Web Audio API Cyber Synthesizer
// Generates ambient cyber hum, scroll velocity data whooshes, and circuit ignition pulses without external audio files.

class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private whooshGain: GainNode | null = null;
  private whooshFilter: BiquadFilterNode | null = null;
  private lastTriggerTime: number = 0;
  private hasIgnited: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Ambient Drone (Cyber Engine)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = "sawtooth";
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = "lowpass";
      this.droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(6, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.droneOsc.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);
      this.droneOsc.start();

      // Velocity Whoosh Noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      this.whooshFilter = this.ctx.createBiquadFilter();
      this.whooshFilter.type = "bandpass";
      this.whooshFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
      this.whooshFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      this.whooshGain = this.ctx.createGain();
      this.whooshGain.gain.setValueAtTime(0, this.ctx.currentTime);

      whiteNoise.connect(this.whooshFilter);
      this.whooshFilter.connect(this.whooshGain);
      this.whooshGain.connect(this.ctx.destination);
      whiteNoise.start();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended" && !muted) {
      this.ctx.resume();
    }

    if (this.droneGain && this.ctx) {
      const targetGain = muted ? 0 : 0.08;
      this.droneGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
    if (this.whooshGain && this.ctx && muted) {
      this.whooshGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // Update whoosh and drone frequency based on scroll progress (0..1) and scroll speed
  public updateScrollDynamics(progress: number, speed: number) {
    if (this.isMuted || !this.ctx || !this.droneFilter || !this.whooshFilter || !this.whooshGain) return;

    const now = this.ctx.currentTime;
    // Map progress to base frequency (deeper in matrix, higher in tunnel/CPU)
    const baseFreq = 120 + progress * 260;
    this.droneFilter.frequency.setTargetAtTime(baseFreq, now, 0.08);

    // Speed modulates whoosh
    const normSpeed = Math.min(speed / 40, 1.0);
    const whooshFreq = 300 + normSpeed * 1200 + progress * 600;
    this.whooshFilter.frequency.setTargetAtTime(whooshFreq, now, 0.05);

    const whooshVol = normSpeed * 0.12;
    this.whooshGain.gain.setTargetAtTime(whooshVol, now, 0.05);

    // Trigger Circuit Ignition Electric Pulse when entering motherboard phase (progress around 0.60)
    if (progress > 0.58 && progress < 0.68 && !this.hasIgnited && now - this.lastTriggerTime > 1.0) {
      this.playCircuitIgnition();
      this.hasIgnited = true;
      this.lastTriggerTime = now;
    } else if (progress < 0.40) {
      this.hasIgnited = false;
    }
  }

  // Electrical spark / circuit ignition sound
  public playCircuitIgnition() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-pitched resonance beep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  // Interactive Click / HUD beep
  public playHudBeep(freq = 1200) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }
}

export const cyberAudio = typeof window !== "undefined" ? new CyberAudioEngine() : null;
