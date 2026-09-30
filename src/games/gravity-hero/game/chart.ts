import { nextRandom } from './random';
import { SUPER_HERO, activeLanes } from './variants';
import type { Variant } from './variants';
import type { Chart, Note, NoteKind } from './types';

const BASE_BPM = 70;
const MAX_BPM = 130;
const BPM_STEP = 5;
const BPM_STEP_SECONDS = 20;
const HOLD_BEATS = 2;
const KIND_WEIGHTS: [NoteKind, number][] = [
  ['eighth', 0.45],
  ['quarter', 0.4],
  ['half', 0.15],
];

export const LEAD_IN_SECONDS = 2;
export const LONG_NOTES_FROM_SECONDS = 60;

export const beatSeconds = (time: number) =>
  60 / Math.min(MAX_BPM, BASE_BPM + Math.floor(time / BPM_STEP_SECONDS) * BPM_STEP);

const pickKind = (value: number, time: number): NoteKind => {
  if (time < LONG_NOTES_FROM_SECONDS) return 'eighth';
  let total = 0;
  for (const [kind, weight] of KIND_WEIGHTS) {
    total += weight;
    if (value < total) return kind;
  }
  return 'half';
};

export const createChart = (seed: number, variant: Variant = SUPER_HERO): Chart => ({
  cursor: LEAD_IN_SECONDS,
  seed,
  nextId: 1,
  busyUntil: Array(variant.laneCount).fill(0),
});

export const extendChart = (chart: Chart, horizon: number, variant: Variant = SUPER_HERO) => {
  const notes: Note[] = [];
  const busyUntil = [...chart.busyUntil];
  let { cursor, seed, nextId } = chart;

  while (cursor < horizon) {
    const beat = beatSeconds(cursor);
    const [kindValue, afterKind] = nextRandom(seed);
    const [laneValue, afterLane] = nextRandom(afterKind);
    seed = afterLane;
    const kind = pickKind(kindValue, cursor);
    const freeLanes = activeLanes(variant, cursor).filter((lane) => busyUntil[lane] <= cursor);

    if (freeLanes.length) {
      const lane = freeLanes[Math.floor(laneValue * freeLanes.length)];
      const duration = kind === 'half' ? HOLD_BEATS * beat : 0;
      notes.push({ id: nextId++, lane, kind, time: cursor, duration, status: 'pending' });
      busyUntil[lane] = cursor + duration + beat / 2;
    }
    cursor += kind === 'eighth' ? beat / 2 : beat;
  }

  return { chart: { cursor, seed, nextId, busyUntil }, notes };
};
