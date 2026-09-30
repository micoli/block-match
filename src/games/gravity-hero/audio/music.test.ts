import { describe, expect, it } from 'vitest';
import { FIRST_BEAT, afterBeat, backingFor, laneFrequency } from './music';
import { beatSeconds } from '../game/chart';

describe('laneFrequency', () => {
  it('gives each lane its own pitch and rises an octave in anti-gravity', () => {
    const pitches = [0, 1, 2, 3].map((lane) => laneFrequency(lane, 'down'));
    expect(new Set(pitches).size).toBe(4);
    expect(laneFrequency(2, 'up')).toBe(laneFrequency(2, 'down') * 2);
  });
});

describe('backing track', () => {
  it('advances beat by beat following the current tempo', () => {
    const next = afterBeat(FIRST_BEAT);
    expect(next).toEqual({ time: beatSeconds(0), index: 1 });
  });

  it('plays kick and bass on strong beats, snare on weak ones, hat on every beat', () => {
    expect(backingFor(0)).toMatchObject({ kick: true, snare: false, hat: true });
    expect(backingFor(0).bass).not.toBeNull();
    expect(backingFor(1)).toMatchObject({ kick: false, snare: true, hat: true, bass: null });
  });

  it('changes the bass root from bar to bar', () => {
    expect(backingFor(0).bass).not.toBe(backingFor(4).bass);
  });
});
