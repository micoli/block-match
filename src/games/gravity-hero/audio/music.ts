import { beatSeconds } from '../game/chart';
import type { Gravity } from '../game/types';

// A minor pentatonic, one note per lane.
const MELODY_HZ = [220, 261.63, 329.63, 392];
const BASS_ROOTS_HZ = [110, 87.31, 130.81, 98];
const BEATS_PER_BAR = 4;

export const laneFrequency = (lane: number, gravity: Gravity) => MELODY_HZ[lane] * (gravity === 'up' ? 2 : 1);

export type Beat = { time: number; index: number };

export const FIRST_BEAT: Beat = { time: 0, index: 0 };

export const afterBeat = ({ time, index }: Beat): Beat => ({ time: time + beatSeconds(time), index: index + 1 });

export const backingFor = (index: number) => {
  const strong = index % 2 === 0;
  const bar = Math.floor(index / BEATS_PER_BAR);
  return {
    kick: strong,
    snare: !strong,
    hat: true,
    bass: strong ? BASS_ROOTS_HZ[bar % BASS_ROOTS_HZ.length] : null,
  };
};
