import { useState, useRef } from 'react';
import {
  applyClear,
  applyGravity,
  areAdjacent,
  cloneBoard,
  createBoard,
  findMatches,
  findPossibleMove,
  hasPossibleMove,
  markClearing,
  planClear,
  planTap,
  resolveSwap,
  shuffleBoard,
  swapTiles,
} from '../game/engine.js';
import { buildEffects } from '../game/effects.js';

const SWAP_MS = 180;
const CLEAR_MS = 260;
const FALL_MS = 300;
const CONVERT_MS = 400;
const EFFECT_MS = 520;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initGoals = (level) => level.goals.map((goal) => ({ ...goal, remaining: goal.target }));

const gainedFor = (goal, stats) => {
  if (goal.type === 'color') return stats.colors[goal.color] ?? 0;
  if (goal.type === 'box') return stats.boxes;
  return stats.ice;
};

const applyStatsToGoals = (goals, stats) =>
  goals.map((goal) => ({ ...goal, remaining: Math.max(0, goal.remaining - gainedFor(goal, stats)) }));

const computeStars = (movesLeft, totalMoves) => {
  const ratio = movesLeft / totalMoves;
  if (ratio >= 0.3) return 3;
  if (ratio >= 0.12) return 2;
  return 1;
};

export const useGame = (level) => {
  const [session] = useState(() => createBoard(level));
  const [board, setBoard] = useState(() => cloneBoard(session.board));
  const [goals, setGoals] = useState(() => initGoals(level));
  const [movesLeft, setMovesLeft] = useState(level.moves);
  const [status, setStatus] = useState('playing');
  const [busy, setBusy] = useState(false);
  const [effects, setEffects] = useState([]);
  const live = useRef({ goals: initGoals(level), movesLeft: level.moves, status: 'playing', busy: false });

  const commit = () => setBoard(cloneBoard(session.board));

  const setLive = (patch) => {
    Object.assign(live.current, patch);
    if (patch.goals) setGoals(patch.goals);
    if (patch.movesLeft !== undefined) setMovesLeft(patch.movesLeft);
    if (patch.status) setStatus(patch.status);
    if (patch.busy !== undefined) setBusy(patch.busy);
  };

  const spawnEffects = (newEffects) => {
    if (!newEffects.length) return;
    const ids = new Set(newEffects.map((effect) => effect.id));
    setEffects((current) => [...current, ...newEffects]);
    setTimeout(() => setEffects((current) => current.filter((effect) => !ids.has(effect.id))), EFFECT_MS);
  };

  const canAct = () => live.current.status === 'playing' && !live.current.busy;

  const cascade = async (firstPlan) => {
    const { board: engineBoard, rng } = session;
    let plan = firstPlan;
    while (plan) {
      spawnEffects(buildEffects(engineBoard, plan));
      markClearing(engineBoard, plan);
      commit();
      await sleep(CLEAR_MS);
      const stats = applyClear(engineBoard, plan);
      setLive({ goals: applyStatsToGoals(live.current.goals, stats) });
      applyGravity(engineBoard, rng);
      commit();
      await sleep(FALL_MS);
      const groups = findMatches(engineBoard);
      plan = groups.length ? planClear(engineBoard, { groups }) : null;
    }
    if (hasPossibleMove(engineBoard)) return;
    shuffleBoard(engineBoard, rng);
    commit();
    await sleep(FALL_MS);
  };

  const settle = () => {
    if (live.current.goals.every((goal) => goal.remaining === 0)) {
      setLive({ status: 'won', busy: false });
      return;
    }
    if (live.current.movesLeft === 0) {
      setLive({ status: 'lost', busy: false });
      return;
    }
    setLive({ busy: false });
  };

  const play = async (plan) => {
    setLive({ movesLeft: live.current.movesLeft - 1 });
    if (plan.converted) {
      commit();
      await sleep(CONVERT_MS);
    }
    await cascade(plan);
    settle();
  };

  const swap = async (from, to) => {
    const engineBoard = session.board;
    if (!canAct() || !areAdjacent(from, to)) return;
    if (!engineBoard.tiles[from.r]?.[from.c] || !engineBoard.tiles[to.r]?.[to.c]) return;

    setLive({ busy: true });
    swapTiles(engineBoard, from, to);
    commit();
    await sleep(SWAP_MS);

    const plan = resolveSwap(engineBoard, from, to, session.rng);
    if (plan) {
      await play(plan);
      return;
    }
    swapTiles(engineBoard, from, to);
    commit();
    await sleep(SWAP_MS);
    setLive({ busy: false });
  };

  const activate = async (pos) => {
    if (!canAct()) return;
    const plan = planTap(session.board, pos);
    if (!plan) return;
    setLive({ busy: true });
    await play(plan);
  };

  const hint = () => (canAct() ? findPossibleMove(session.board) : null);

  return {
    board,
    goals,
    movesLeft,
    status,
    busy,
    effects,
    stars: status === 'won' ? computeStars(movesLeft, level.moves) : 0,
    swap,
    activate,
    hint,
  };
};
