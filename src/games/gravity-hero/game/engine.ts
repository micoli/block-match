import { LEAD_IN_SECONDS, createChart, extendChart } from './chart';
import { withAntigravBonus } from '../../../shared/gravity';
import { nextRandom } from './random';
import type { Action, GameState, JudgmentType, Note, NoteKind } from './types';

export const TRAVEL_SECONDS = 2.2;
export const PERFECT_WINDOW = 0.07;
export const GOOD_WINDOW = 0.14;
export const MAX_MISSES = 10;
export const FLIP_MIN_SECONDS = 10;
export const FLIP_MAX_SECONDS = 15;

export const PERFECTS_TO_RECOVER = 3;

const HOLD_RELEASE_TOLERANCE = 0.25;
const MAX_MULTIPLIER = 4;
const COMBO_PER_MULTIPLIER = 10;
const HOLD_BONUS = 150;
const BASE_POINTS: Record<NoteKind, number> = { eighth: 50, quarter: 100, half: 150 };
const GOOD_FACTOR = 0.5;

export const multiplierFor = (combo: number) => Math.min(MAX_MULTIPLIER, 1 + Math.floor(combo / COMBO_PER_MULTIPLIER));

const drawFlipTime = (from: number, seed: number): [number, number] => {
  const [value, nextSeed] = nextRandom(seed);
  return [from + FLIP_MIN_SECONDS + value * (FLIP_MAX_SECONDS - FLIP_MIN_SECONDS), nextSeed];
};

export const createGame = (seed: number, gravityEnabled = true): GameState => {
  const { chart, notes } = extendChart(createChart(seed), LEAD_IN_SECONDS + TRAVEL_SECONDS);
  const [nextFlipAt, flipSeed] = drawFlipTime(0, seed ^ 0x9e3779b9);
  return {
    status: 'playing',
    time: 0,
    notes,
    chart,
    gravity: 'down',
    gravityEnabled,
    flips: 0,
    flipSeed,
    nextFlipAt,
    score: 0,
    combo: 0,
    perfectStreak: 0,
    bestCombo: 0,
    hits: 0,
    misses: 0,
    judgment: null,
  };
};

const judge = (state: GameState, lane: number, type: JudgmentType) => ({
  id: (state.judgment?.id ?? 0) + 1,
  lane,
  type,
});

const withoutNote = (state: GameState, note: Note) => state.notes.filter(({ id }) => id !== note.id);

const registerMiss = (state: GameState, note: Note): GameState => {
  const misses = state.misses + 1;
  return {
    ...state,
    notes: withoutNote(state, note),
    misses,
    combo: 0,
    perfectStreak: 0,
    judgment: judge(state, note.lane, 'miss'),
    status: misses >= MAX_MISSES ? 'over' : state.status,
  };
};

const award = (state: GameState, base: number): GameState => ({
  ...state,
  score: state.score + withAntigravBonus(base * multiplierFor(state.combo), state.gravity === 'up'),
});

const completeHold = (state: GameState, note: Note): GameState => ({
  ...award(state, HOLD_BONUS),
  notes: withoutNote(state, note),
});

const press = (state: GameState, lane: number): GameState => {
  if (state.status === 'over') return state;
  const target = state.notes
    .filter((note) => note.lane === lane && note.status === 'pending')
    .map((note) => ({ note, offset: Math.abs(note.time - state.time) }))
    .filter(({ offset }) => offset <= GOOD_WINDOW)
    .sort((a, b) => a.offset - b.offset)[0];
  if (!target) return { ...state, combo: 0, perfectStreak: 0 };

  const { note, offset } = target;
  const type = offset <= PERFECT_WINDOW ? 'perfect' : 'good';
  const combo = state.combo + 1;
  const points = Math.round(BASE_POINTS[note.kind] * (type === 'perfect' ? 1 : GOOD_FACTOR));
  const streak = type === 'perfect' ? state.perfectStreak + 1 : 0;
  const recovered = streak >= PERFECTS_TO_RECOVER;
  const scored = award({ ...state, combo }, points);
  return {
    ...scored,
    perfectStreak: recovered ? 0 : streak,
    misses: recovered ? Math.max(0, state.misses - 1) : state.misses,
    hits: state.hits + 1,
    bestCombo: Math.max(state.bestCombo, combo),
    judgment: judge(state, lane, type),
    notes: note.duration
      ? state.notes.map((candidate) => (candidate.id === note.id ? { ...candidate, status: 'holding' } : candidate))
      : withoutNote(state, note),
  };
};

const release = (state: GameState, lane: number): GameState => {
  const note = state.notes.find((candidate) => candidate.lane === lane && candidate.status === 'holding');
  if (!note) return state;
  const remaining = note.time + note.duration - state.time;
  if (remaining <= HOLD_RELEASE_TOLERANCE) return completeHold(state, note);
  return registerMiss(state, note);
};

const maybeFlip = (state: GameState): GameState => {
  if (!state.gravityEnabled || state.time < state.nextFlipAt) return state;
  const [nextFlipAt, flipSeed] = drawFlipTime(state.time, state.flipSeed);
  return {
    ...state,
    gravity: state.gravity === 'down' ? 'up' : 'down',
    flips: state.flips + 1,
    flipSeed,
    nextFlipAt,
  };
};

const tick = (state: GameState, dt: number): GameState => {
  if (state.status === 'over') return state;
  const time = state.time + dt;
  const { chart, notes: spawned } = extendChart(state.chart, time + TRAVEL_SECONDS);
  let next: GameState = { ...state, time, chart, notes: [...state.notes, ...spawned] };

  for (const note of state.notes) {
    if (next.status === 'over') break;
    if (note.status === 'pending' && time - note.time > GOOD_WINDOW) next = registerMiss(next, note);
    if (note.status === 'holding' && time >= note.time + note.duration) next = completeHold(next, note);
  }
  return maybeFlip(next);
};

export const reduce = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'tick':
      return tick(state, action.dt);
    case 'press':
      return press(state, action.lane);
    case 'release':
      return release(state, action.lane);
    case 'restart':
      return createGame(action.seed, state.gravityEnabled);
  }
};
