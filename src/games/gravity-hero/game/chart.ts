import { nextRandom } from './random';
import { LANES } from './types';
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

const LANE_STAGES = [
  { from: 0, lanes: [1, 2] },
  { from: 10, lanes: [0, 1, 2] },
  { from: 40, lanes: [0, 1, 2, 3] },
];

export const activeLanes = (time: number) =>
  LANE_STAGES.filter((stage) => time >= stage.from).at(-1)?.lanes ?? LANE_STAGES[0].lanes;

export const beatSeconds = (time: number) =>
  60 / Math.min(MAX_BPM, BASE_BPM + Math.floor(time / BPM_STEP_SECONDS) * BPM_STEP);

const pickKind = (value: number): NoteKind => {
  let total = 0;
  for (const [kind, weight] of KIND_WEIGHTS) {
    total += weight;
    if (value < total) return kind;
  }
  return 'half';
};

export const createChart = (seed: number): Chart => ({
  cursor: LEAD_IN_SECONDS,
  seed,
  nextId: 1,
  busyUntil: Array(LANES).fill(0),
});

export const extendChart = (chart: Chart, horizon: number) => {
  const notes: Note[] = [];
  const busyUntil = [...chart.busyUntil];
  let { cursor, seed, nextId } = chart;

  while (cursor < horizon) {
    const beat = beatSeconds(cursor);
    const [kindValue, afterKind] = nextRandom(seed);
    const [laneValue, afterLane] = nextRandom(afterKind);
    seed = afterLane;
    const kind = pickKind(kindValue);
    const freeLanes = activeLanes(cursor).filter((lane) => busyUntil[lane] <= cursor);

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
