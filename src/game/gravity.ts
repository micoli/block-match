import { createRng, hashSeed } from './rng';
import type { Gravity } from './types';

const MIN_INTERVAL = 3;
const MAX_INTERVAL = 6;
const SCHEDULE_LENGTH = 80;

// Move counts (cumulative) after which gravity flips.
export const createGravityFlips = (seed: string, levelNumber: number) => {
  const rng = createRng(hashSeed(`${seed}:gravity:${levelNumber}`));
  const flips: number[] = [];
  let total = 0;
  while (total < SCHEDULE_LENGTH) {
    total += rng.int(MIN_INTERVAL, MAX_INTERVAL);
    flips.push(total);
  }
  return flips;
};

export const gravityAfter = (flips: number[], movesPlayed: number): Gravity =>
  flips.filter((flip) => flip <= movesPlayed).length % 2 === 0 ? 'down' : 'up';

export const movesUntilFlip = (flips: number[], movesPlayed: number) => {
  const next = flips.find((flip) => flip > movesPlayed);
  return next === undefined ? null : next - movesPlayed;
};
