import type { Rng } from './types';

export const hashSeed = (text: string) => {
  let h1 = 0xdeadbeef ^ text.length;
  let h2 = 0x41c6ce57 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return h1 >>> 0;
};

// mulberry32
export const createRng = (seed: number): Rng => {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const pick = <T>(items: T[]): T => items[int(0, items.length - 1)];
  const chance = (probability: number) => next() < probability;
  const shuffle = <T>(items: T[]) => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = int(0, i);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  const getState = () => state;
  const setState = (value: number) => {
    state = value;
  };

  return { next, int, pick, chance, shuffle, getState, setState };
};
