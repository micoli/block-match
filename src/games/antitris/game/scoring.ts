const LINE_POINTS = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;
const BASE_INTERVAL_MS = 800;
const MIN_INTERVAL_MS = 80;
const SPEED_FACTOR = 0.85;

export const HARD_DROP_POINTS_PER_ROW = 2;

export const levelFor = (lines: number) => 1 + Math.floor(lines / LINES_PER_LEVEL);

export const lineClearPoints = (lines: number, level: number) => LINE_POINTS[lines] * level;

export const tickInterval = (level: number) =>
  Math.max(MIN_INTERVAL_MS, Math.round(BASE_INTERVAL_MS * SPEED_FACTOR ** (level - 1)));
