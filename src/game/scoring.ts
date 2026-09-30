import type { ClearStats } from './types';

const POINTS_PER_TILE = 10;
const POINTS_PER_STRUCTURE = 30;
const POINTS_PER_REMAINING_MOVE = 300;

export const clearPoints = (clearedCount: number, chain: number, stats: Pick<ClearStats, 'boxes' | 'ice'>) =>
  clearedCount * POINTS_PER_TILE * chain + (stats.boxes + stats.ice) * POINTS_PER_STRUCTURE;

export const remainingMovePoints = () => POINTS_PER_REMAINING_MOVE;
