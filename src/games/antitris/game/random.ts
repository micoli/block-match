import { KINDS } from './pieces';
import type { Kind } from './types';

export const nextRandom = (seed: number): [number, number] => {
  const state = (seed + 0x6d2b79f5) | 0;
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, state];
};

export const randomInt = (seed: number, min: number, max: number): [number, number] => {
  const [value, nextSeed] = nextRandom(seed);
  return [min + Math.floor(value * (max - min + 1)), nextSeed];
};

const shuffledKinds = (seed: number): [Kind[], number] => {
  const kinds = [...KINDS];
  let current = seed;
  for (let i = kinds.length - 1; i > 0; i--) {
    const [j, nextSeed] = randomInt(current, 0, i);
    current = nextSeed;
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return [kinds, current];
};

// 7-bag: every kind appears once before any repeats.
export const drawFromBag = (bag: Kind[], seed: number) => {
  const [available, nextSeed] = bag.length ? [bag, seed] : shuffledKinds(seed);
  const [kind, ...rest] = available;
  return { kind, bag: rest, seed: nextSeed };
};
