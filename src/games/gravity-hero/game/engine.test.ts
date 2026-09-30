import { describe, expect, it } from 'vitest';
import {
  FLIP_MAX_SECONDS,
  FLIP_MIN_SECONDS,
  GOOD_WINDOW,
  MAX_MISSES,
  PERFECT_WINDOW,
  createGame,
  multiplierFor,
  reduce,
} from './engine';
import { createChart, extendChart } from './chart';
import { LANES } from './types';
import type { GameState } from './types';

const advance = (state: GameState, seconds: number, step = 0.05) => {
  let current = state;
  for (let elapsed = 0; elapsed < seconds; elapsed += step) current = reduce(current, { type: 'tick', dt: step });
  return current;
};

const firstNote = (state: GameState, kind?: string) =>
  state.notes.find((note) => !kind || note.kind === kind) ?? state.notes[0];

describe('chart', () => {
  it('is deterministic for a seed and uses the 4 lanes and 3 note kinds', () => {
    const { notes } = extendChart(createChart(5), 120);
    expect(extendChart(createChart(5), 120).notes).toEqual(notes);
    expect(notes.every((note) => note.lane >= 0 && note.lane < LANES)).toBe(true);
    expect(new Set(notes.map((note) => note.kind))).toEqual(new Set(['eighth', 'quarter', 'half']));
  });

  it('never overlaps two notes in a lane held by a half note', () => {
    const { notes } = extendChart(createChart(9), 120);
    notes
      .filter((note) => note.duration)
      .forEach((hold) => {
        const clash = notes.filter(
          (note) => note.lane === hold.lane && note.id !== hold.id && note.time > hold.time && note.time < hold.time + hold.duration,
        );
        expect(clash).toEqual([]);
      });
  });
});

describe('lane progression', () => {
  const lanesBetween = (from: number, to: number) =>
    new Set(
      extendChart(createChart(11), 200)
        .notes.filter((note) => note.time >= from && note.time < to)
        .map((note) => note.lane),
    );

  it('starts with 2 lanes, then 3 after 10 seconds, then 4 after 40 seconds', () => {
    expect(lanesBetween(0, 10).size).toBe(2);
    expect(lanesBetween(10, 40).size).toBe(3);
    expect(lanesBetween(40, 200).size).toBe(4);
  });
});

describe('judging', () => {
  it('scores a perfect tap and builds the combo', () => {
    const start = createGame(1);
    const note = start.notes[0];
    const ready = reduce(start, { type: 'tick', dt: note.time });
    const hit = reduce(ready, { type: 'press', lane: note.lane });
    expect(hit.judgment?.type).toBe('perfect');
    expect(hit.score).toBeGreaterThan(0);
    expect(hit.combo).toBe(1);
    expect(hit.notes.find(({ id }) => id === note.id)).toBeUndefined();
  });

  it('scores a good tap lower than a perfect one', () => {
    const start = createGame(1);
    const note = start.notes[0];
    const perfect = reduce(reduce(start, { type: 'tick', dt: note.time }), { type: 'press', lane: note.lane });
    const late = reduce(start, { type: 'tick', dt: note.time + (PERFECT_WINDOW + GOOD_WINDOW) / 2 });
    const good = reduce(late, { type: 'press', lane: note.lane });
    expect(good.judgment?.type).toBe('good');
    expect(good.score).toBeLessThan(perfect.score);
  });

  it('counts a missed note and resets the combo', () => {
    const start = { ...createGame(1), combo: 7 };
    const note = start.notes[0];
    const missed = reduce(start, { type: 'tick', dt: note.time + GOOD_WINDOW + 0.05 });
    expect(missed.misses).toBe(1);
    expect(missed.combo).toBe(0);
    expect(missed.judgment?.type).toBe('miss');
  });

  it('resets the combo on a stray tap', () => {
    const state = reduce({ ...createGame(1), combo: 5 }, { type: 'press', lane: 0 });
    expect(state.combo).toBe(0);
  });

  it('caps the multiplier at x4', () => {
    expect(multiplierFor(0)).toBe(1);
    expect(multiplierFor(10)).toBe(2);
    expect(multiplierFor(500)).toBe(4);
  });
});

describe('recovery', () => {
  const tapAtTime = (state: GameState, index: number) => {
    const note = state.notes[index];
    return reduce({ ...state, time: note.time }, { type: 'press', lane: note.lane });
  };

  it('removes a miss after 3 consecutive perfects', () => {
    const start = { ...createGame(1), misses: 2 };
    const { notes } = extendChart(createChart(1), 10);
    let state: GameState = { ...start, notes };
    for (let i = 0; i < 3; i++) state = tapAtTime(state, 0);
    expect(state.misses).toBe(1);
    expect(state.perfectStreak).toBe(0);
  });

  it('breaks the streak on a stray tap', () => {
    const state = reduce({ ...createGame(1), perfectStreak: 2 }, { type: 'press', lane: 0 });
    expect(state.perfectStreak).toBe(0);
  });
});

describe('hold notes', () => {
  const holdState = () => {
    let state = createGame(2);
    while (!state.notes.some((note) => note.kind === 'half')) state = reduce(state, { type: 'tick', dt: 0.5 });
    const hold = firstNote(state, 'half');
    return { state: { ...state, misses: 0, combo: 0, notes: [hold], chart: { ...state.chart, cursor: 1e9 } }, hold };
  };

  it('completes when held until the end', () => {
    const { state, hold } = holdState();
    const at = reduce(state, { type: 'tick', dt: Math.max(0, hold.time - state.time) });
    const holding = reduce(at, { type: 'press', lane: hold.lane });
    expect(holding.notes.find(({ id }) => id === hold.id)?.status).toBe('holding');
    const done = reduce(holding, { type: 'tick', dt: hold.duration + 0.01 });
    expect(done.notes.find(({ id }) => id === hold.id)).toBeUndefined();
    expect(done.misses).toBe(0);
    expect(done.score).toBeGreaterThan(holding.score);
  });

  it('counts a miss when released too early', () => {
    const { state, hold } = holdState();
    const at = reduce(state, { type: 'tick', dt: Math.max(0, hold.time - state.time) });
    const holding = reduce(at, { type: 'press', lane: hold.lane });
    const released = reduce(holding, { type: 'release', lane: hold.lane });
    expect(released.misses).toBe(1);
  });
});

describe('gravity flip', () => {
  it('flips every 10 to 15 seconds', () => {
    let state = createGame(3);
    const flipTimes: number[] = [];
    while (flipTimes.length < 4) {
      const flips = state.flips;
      state = { ...reduce(state, { type: 'tick', dt: 0.05 }), misses: 0, status: 'playing' };
      if (state.flips !== flips) flipTimes.push(state.time);
    }
    flipTimes.forEach((time, i) => {
      const gap = time - (flipTimes[i - 1] ?? 0);
      expect(gap).toBeGreaterThanOrEqual(FLIP_MIN_SECONDS - 0.06);
      expect(gap).toBeLessThanOrEqual(FLIP_MAX_SECONDS + 0.06);
    });
    expect(state.gravity).toBe('down');
  });
});

describe('game over', () => {
  it('ends the game after too many misses', () => {
    const state = advance(createGame(4), 60);
    expect(state.status).toBe('over');
    expect(state.misses).toBe(MAX_MISSES);
  });

  it('ignores ticks once over', () => {
    const over = advance(createGame(4), 60);
    expect(reduce(over, { type: 'tick', dt: 1 })).toBe(over);
  });
});
