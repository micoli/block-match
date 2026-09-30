export type Synth = {
  resume: () => void;
  note: (frequency: number, long: boolean) => void;
  bass: (frequency: number) => void;
  kick: () => void;
  snare: () => void;
  hat: () => void;
  flip: () => void;
  miss: () => void;
  gameOver: () => void;
  close: () => void;
};

type Tone = { frequency: number; type: OscillatorType; duration: number; gain: number; slideTo?: number };
type Noise = { duration: number; gain: number; highpass: number };

const SILENCE = 0.0001;

const createNoiseBuffer = (ctx: AudioContext) => {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

export const createSynth = (): Synth => {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);
  const noiseBuffer = createNoiseBuffer(ctx);

  const envelope = (gain: number, duration: number) => {
    const node = ctx.createGain();
    node.gain.setValueAtTime(SILENCE, ctx.currentTime);
    node.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
    node.gain.exponentialRampToValueAtTime(SILENCE, ctx.currentTime + duration);
    node.connect(master);
    return node;
  };

  const tone = ({ frequency, type, duration, gain, slideTo }: Tone) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
    osc.connect(envelope(gain, duration));
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  };

  const noise = ({ duration, gain, highpass }: Noise) => {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = highpass;
    source.connect(filter).connect(envelope(gain, duration));
    source.start();
    source.stop(ctx.currentTime + duration + 0.05);
  };

  return {
    resume: () => {
      if (ctx.state === 'suspended') void ctx.resume();
    },
    note: (frequency, long) => tone({ frequency, type: 'square', duration: long ? 0.9 : 0.25, gain: 0.16 }),
    bass: (frequency) => tone({ frequency, type: 'triangle', duration: 0.4, gain: 0.45 }),
    kick: () => tone({ frequency: 150, type: 'sine', duration: 0.18, gain: 0.8, slideTo: 45 }),
    snare: () => noise({ duration: 0.12, gain: 0.3, highpass: 1500 }),
    hat: () => noise({ duration: 0.04, gain: 0.12, highpass: 7000 }),
    flip: () => tone({ frequency: 180, type: 'sawtooth', duration: 0.6, gain: 0.2, slideTo: 900 }),
    miss: () => tone({ frequency: 110, type: 'sawtooth', duration: 0.18, gain: 0.15, slideTo: 60 }),
    gameOver: () => tone({ frequency: 330, type: 'triangle', duration: 1, gain: 0.4, slideTo: 55 }),
    close: () => void ctx.close(),
  };
};
