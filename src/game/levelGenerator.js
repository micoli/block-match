import { createGrid, setMirrored } from './grid.js';
import { createRng, hashSeed } from './rng.js';

const DIFFICULTY_RAMP = 60;
const MAX_GOALS = 3;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const roundTo5 = (value) => Math.max(5, Math.round(value / 5) * 5);
const countCells = (grid) => grid.flat().filter((value) => value > 0).length;
const sumCells = (grid) => grid.flat().reduce((sum, value) => sum + value, 0);

const carveShape = (rng, rows, cols, number) => {
  const holes = createGrid(rows, cols, false);
  if (number < 3 || !rng.chance(0.55)) return holes;

  const pattern = rng.pick(['corners', 'topNotch', 'bottomNotch', 'pillars']);
  const half = Math.ceil(cols / 2);

  if (pattern === 'corners') {
    const size = rng.int(1, 2);
    const bottom = rng.chance(0.5);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        setMirrored(holes, i, j, true);
        if (bottom) setMirrored(holes, rows - 1 - i, j, true);
      }
    }
    return holes;
  }

  if (pattern === 'pillars') {
    const count = rng.int(1, 2);
    for (let i = 0; i < count; i++) setMirrored(holes, rng.int(2, rows - 3), rng.int(1, half - 1), true);
    return holes;
  }

  const depth = rng.int(1, 2);
  const width = rng.int(1, 2);
  const center = Math.floor((cols - 1) / 2);
  for (let d = 0; d < depth; d++) {
    const row = pattern === 'topNotch' ? d : rows - 1 - d;
    for (let w = 0; w < width; w++) setMirrored(holes, row, center - w, true);
  }
  return holes;
};

const placeBoxes = (rng, holes, rows, cols, number, difficulty) => {
  const boxes = createGrid(rows, cols, 0);
  if (number < 3 || !rng.chance(0.5 + difficulty * 0.4)) return boxes;

  const strongChance = 0.1 + difficulty * 0.6;
  const half = Math.ceil(cols / 2);
  const place = (r, c) => {
    if (holes[r][c] || holes[r][cols - 1 - c]) return;
    setMirrored(boxes, r, c, rng.chance(strongChance) ? 2 : 1);
  };

  if (rng.chance(0.5)) {
    const depth = rng.int(1, 1 + Math.round(difficulty * 2));
    const margin = rng.int(0, 2);
    for (let d = 0; d < depth; d++) {
      for (let c = margin; c < half; c++) place(rows - 1 - d, c);
    }
    return boxes;
  }

  const count = rng.int(2, 3 + Math.round(difficulty * 6));
  for (let i = 0; i < count; i++) place(rng.int(3, rows - 1), rng.int(0, half - 1));
  return boxes;
};

const placeIce = (rng, holes, boxes, rows, cols, number, difficulty) => {
  const ice = createGrid(rows, cols, 0);
  if (number < 5 || !rng.chance(0.35 + difficulty * 0.35)) return ice;

  const half = Math.ceil(cols / 2);
  const height = rng.int(2, 3 + Math.round(difficulty * 2));
  const width = rng.int(1, half);
  const top = rng.int(1, rows - height);
  const layers = rng.chance(0.1 + difficulty * 0.5) ? 2 : 1;
  const isFree = (r, c) => !holes[r][c] && boxes[r][c] === 0;

  for (let r = top; r < top + height; r++) {
    for (let c = half - width; c < half; c++) {
      if (isFree(r, c) && isFree(r, cols - 1 - c)) setMirrored(ice, r, c, layers);
    }
  }
  return ice;
};

const buildGoals = (rng, colors, boxes, ice, difficulty) => {
  const goals = [];
  const boxCount = countCells(boxes);
  const iceCount = countCells(ice);
  if (boxCount) goals.push({ type: 'box', target: boxCount });
  if (iceCount) goals.push({ type: 'ice', target: iceCount });

  const colorGoals = Math.min(MAX_GOALS - goals.length, rng.int(goals.length ? 0 : 1, 2));
  const palette = rng.shuffle(Array.from({ length: colors }, (_, i) => i));
  for (let i = 0; i < colorGoals; i++) {
    goals.push({ type: 'color', color: palette[i], target: roundTo5(8 + difficulty * 30 + rng.int(0, 10)) });
  }
  return goals;
};

const computeMoves = (goals, boxes, ice, colors, difficulty) => {
  const colorRate = colors <= 4 ? 3 : colors === 5 ? 2.4 : 1.9;
  const effort = goals.reduce((sum, goal) => {
    if (goal.type === 'color') return sum + goal.target / colorRate;
    if (goal.type === 'box') return sum + sumCells(boxes) / 1.3;
    return sum + sumCells(ice) / 2.6;
  }, 0);
  const slack = 1.05 - difficulty * 0.35;
  return clamp(Math.round(effort * slack + 3), 10, 40);
};

export const generateLevel = (seed, number) => {
  const rng = createRng(hashSeed(`${seed}:level:${number}`));
  const difficulty = Math.min(1, (number - 1) / DIFFICULTY_RAMP);
  const cols = number <= 3 ? 7 : rng.int(7, 9);
  const rows = number <= 3 ? 8 : rng.int(8, 9);
  const colors = number <= 4 ? 4 : rng.chance(difficulty * 0.3) ? 6 : 5;

  const holes = carveShape(rng, rows, cols, number);
  const boxes = placeBoxes(rng, holes, rows, cols, number, difficulty);
  const ice = placeIce(rng, holes, boxes, rows, cols, number, difficulty);
  const goals = buildGoals(rng, colors, boxes, ice, difficulty);

  return {
    seed,
    number,
    difficulty,
    rows,
    cols,
    colors,
    holes,
    boxes,
    ice,
    goals,
    moves: computeMoves(goals, boxes, ice, colors, difficulty),
    tileSeed: hashSeed(`${seed}:tiles:${number}`),
  };
};
