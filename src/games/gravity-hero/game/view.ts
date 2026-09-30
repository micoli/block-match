import { TRAVEL_SECONDS } from './engine';
import type { Gravity, Note } from './types';

export const BOARD_ROWS = 9;
export const HEAD_SIZE = 0.8 / BOARD_ROWS;
export const ZONE = 0.86;

const SPEED = ZONE / TRAVEL_SECONDS;

export const zoneTop = (gravity: Gravity) => (gravity === 'down' ? ZONE : 1 - ZONE) - HEAD_SIZE / 2;

export const noteBox = (gravity: Gravity, note: Note, now: number) => {
  const headDistance = Math.max(0, note.time - now) * SPEED;
  const tailDistance = Math.max(0, note.time + note.duration - now) * SPEED;
  const top = gravity === 'down' ? ZONE - tailDistance : 1 - ZONE + headDistance;
  return { top: top - HEAD_SIZE / 2, height: tailDistance - headDistance + HEAD_SIZE };
};
