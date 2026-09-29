import {
  applyClear,
  applyGravity,
  areAdjacent,
  cloneBoard,
  createBoard,
  findMatches,
  hasPossibleMove,
  planClear,
  planTap,
  resolveSwap,
  shuffleBoard,
  swapTiles,
} from './engine.js';
import { createRng } from './rng.js';

const cloneRng = (rng) => {
  const copy = createRng(0);
  copy.setState(rng.getState());
  return copy;
};

const gainedFor = (goal, stats) => {
  if (goal.type === 'color') return stats.colors[goal.color] ?? 0;
  if (goal.type === 'box') return stats.boxes;
  return stats.ice;
};

const applyStats = (remaining, goals, stats) =>
  remaining.map((left, i) => Math.max(0, left - gainedFor(goals[i], stats)));

const runCascade = (board, rng, firstPlan, goals, remaining) => {
  let plan = firstPlan;
  let left = remaining;
  while (plan) {
    left = applyStats(left, goals, applyClear(board, plan));
    applyGravity(board, rng);
    const groups = findMatches(board);
    plan = groups.length ? planClear(board, { groups }) : null;
  }
  if (!hasPossibleMove(board)) shuffleBoard(board, rng);
  return left;
};

const listMoves = (board) => {
  const moves = [];
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (!board.tiles[r][c]) continue;
      if (board.tiles[r][c].special) moves.push({ type: 'tap', from: { r, c } });
      for (const to of [{ r, c: c + 1 }, { r: r + 1, c }]) {
        if (!board.tiles[to.r]?.[to.c] || !areAdjacent({ r, c }, to)) continue;
        moves.push({ type: 'swap', from: { r, c }, to });
      }
    }
  }
  return moves;
};

const tryMove = (state, move, goals) => {
  const board = cloneBoard(state.board);
  const rng = cloneRng(state.rng);
  let plan;
  if (move.type === 'tap') {
    plan = planTap(board, move.from);
  } else {
    swapTiles(board, move.from, move.to);
    plan = resolveSwap(board, move.from, move.to, rng);
  }
  if (!plan) return null;
  const remaining = runCascade(board, rng, plan, goals, state.remaining);
  return { board, rng, remaining };
};

const progressOf = (remaining, goals) =>
  remaining.reduce((sum, left, i) => sum + left / (goals[i].type === 'color' ? 1 : 1.5), 0);

const countSpecials = (board) => board.tiles.flat().filter((tile) => tile?.special).length;

const score = (state, goals) => -progressOf(state.remaining, goals) * 10 + countSpecials(state.board);

const bestMove = (state, goals) => {
  let best = null;
  for (const move of listMoves(state.board)) {
    const next = tryMove(state, move, goals);
    if (!next) continue;
    const value = score(next, goals);
    if (!best || value > best.value) best = { value, next };
  }
  return best?.next ?? null;
};

// Plays a greedy bot with the exact engine and seeded rng: the returned count is a move
// budget for which a winning sequence is known to exist.
export const solve = (level, maxMoves) => {
  const { board, rng } = createBoard(level);
  const goals = level.goals;
  let state = { board, rng, remaining: goals.map((goal) => goal.target) };
  for (let moves = 1; moves <= maxMoves; moves++) {
    const next = bestMove(state, goals);
    if (!next) return null;
    state = next;
    if (state.remaining.every((left) => left === 0)) return moves;
  }
  return null;
};
