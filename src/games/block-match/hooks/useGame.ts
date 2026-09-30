import { useState, useRef } from 'react';
import {
  applyClear,
  applyGravity,
  areAdjacent,
  cloneBoard,
  createBoard,
  createTile,
  findMatches,
  findPossibleMove,
  hasPossibleMove,
  markClearing,
  planClear,
  planTap,
  resolveSwap,
  shuffleBoard,
  swapTiles,
} from '../game/engine';
import { buildEffects, createVortexEffect } from '../game/effects';
import { gravityAfter, movesUntilFlip } from '../game/gravity';
import { clearPoints, remainingMovePoints } from '../game/scoring';
import type { ClearStats, Effect, Goal, GoalProgress, GameStatus, Gravity, Level, Plan, Pos, Special } from '../game/types';

type Live = {
  goals: GoalProgress[];
  movesLeft: number;
  status: GameStatus;
  busy: boolean;
  score: number;
  bonus: number;
  finale: boolean;
  speed: number;
  gravity: Gravity;
};

const SWAP_MS = 180;
const CLEAR_MS = 260;
const FALL_MS = 300;
const CONVERT_MS = 400;
const EFFECT_MS = 520;
const VORTEX_MS = 1000;
const FINALE_CONVERT_MS = 250;
const FINALE_SPEED = 2;
const FINALE_ROCKETS: Special[] = ['rocketH', 'rocketV'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initGoals = (level: Level): GoalProgress[] => level.goals.map((goal) => ({ ...goal, remaining: goal.target }));

const gainedFor = (goal: Goal, stats: ClearStats) => {
  if (goal.type === 'color') return stats.colors[goal.color] ?? 0;
  if (goal.type === 'box') return stats.boxes;
  return stats.ice;
};

const applyStatsToGoals = (goals: GoalProgress[], stats: ClearStats) =>
  goals.map((goal) => ({ ...goal, remaining: Math.max(0, goal.remaining - gainedFor(goal, stats)) }));

const computeStars = (movesLeft: number, totalMoves: number) => {
  const ratio = movesLeft / totalMoves;
  if (ratio >= 0.3) return 3;
  if (ratio >= 0.12) return 2;
  return 1;
};

export const useGame = (level: Level) => {
  const [session] = useState(() => createBoard(level));
  const [board, setBoard] = useState(() => cloneBoard(session.board));
  const [goals, setGoals] = useState(() => initGoals(level));
  const [movesLeft, setMovesLeft] = useState(level.moves);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [busy, setBusy] = useState(false);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [score, setScore] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [stars, setStars] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [gravity, setGravity] = useState<Gravity>('down');
  const live = useRef<Live>({
    goals: initGoals(level),
    movesLeft: level.moves,
    status: 'playing',
    busy: false,
    score: 0,
    bonus: 0,
    finale: false,
    speed: 1,
    gravity: 'down',
  });

  const wait = (ms: number) => sleep(ms / live.current.speed);

  const commit = () => setBoard(cloneBoard(session.board));

  const setLive = (patch: Partial<Live>) => {
    Object.assign(live.current, patch);
    if (patch.goals) setGoals(patch.goals);
    if (patch.movesLeft !== undefined) setMovesLeft(patch.movesLeft);
    if (patch.status) setStatus(patch.status);
    if (patch.busy !== undefined) setBusy(patch.busy);
  };

  const addPoints = (points: number) => {
    setLive({ score: live.current.score + points });
    setScore(live.current.score);
    if (!live.current.finale) return;
    live.current.bonus += points;
    setBonus(live.current.bonus);
  };

  const spawnEffects = (newEffects: Effect[], durationMs = EFFECT_MS) => {
    if (!newEffects.length) return;
    const ids = new Set(newEffects.map((effect) => effect.id));
    setEffects((current) => [...current, ...newEffects]);
    setTimeout(() => setEffects((current) => current.filter((effect) => !ids.has(effect.id))), durationMs / live.current.speed);
  };

  const canAct = () => live.current.status === 'playing' && !live.current.busy;

  const cascade = async (firstPlan: Plan | null) => {
    const { board: engineBoard, rng } = session;
    let plan: Plan | null = firstPlan;
    let chain = 0;
    while (plan) {
      chain++;
      spawnEffects(buildEffects(engineBoard, plan));
      markClearing(engineBoard, plan);
      commit();
      await wait(CLEAR_MS);
      const stats = applyClear(engineBoard, plan);
      setLive({ goals: applyStatsToGoals(live.current.goals, stats) });
      addPoints(clearPoints(plan.cleared.length, chain, stats));
      applyGravity(engineBoard, rng);
      commit();
      await wait(FALL_MS);
      const groups = findMatches(engineBoard);
      plan = groups.length ? planClear(engineBoard, { groups }) : null;
    }
    if (hasPossibleMove(engineBoard)) return;
    shuffleBoard(engineBoard, rng);
    commit();
    await wait(FALL_MS);
  };

  const explodeRemaining = async () => {
    const engineBoard = session.board;
    const plan = planClear(engineBoard, {
      activations: [{ r: Math.floor(engineBoard.rows / 2), c: Math.floor(engineBoard.cols / 2), type: 'all' }],
    });
    spawnEffects(buildEffects(engineBoard, plan));
    markClearing(engineBoard, plan);
    commit();
    await wait(CLEAR_MS);
    const stats = applyClear(engineBoard, plan);
    addPoints(clearPoints(plan.cleared.length, 1, stats));
    commit();
    await wait(FALL_MS);
  };

  const convertRemainingMove = () => {
    const { board: engineBoard, rng } = session;
    const candidates = engineBoard.tiles
      .flatMap((row, r) => row.map((tile, c) => ({ tile, r, c })))
      .filter(({ tile }) => tile && !tile.special);
    if (!candidates.length) return null;
    const { r, c } = rng.pick(candidates);
    engineBoard.tiles[r][c] = createTile(null, rng.pick(FINALE_ROCKETS), { pop: true });
    return { r, c };
  };

  const finale = async () => {
    live.current.finale = true;
    live.current.speed = FINALE_SPEED;
    setSpeed(FINALE_SPEED);
    while (live.current.movesLeft > 0) {
      const pos = convertRemainingMove();
      if (!pos) break;
      setLive({ movesLeft: live.current.movesLeft - 1 });
      addPoints(remainingMovePoints());
      commit();
      await wait(FINALE_CONVERT_MS);
      await cascade(planTap(session.board, pos));
    }
    await explodeRemaining();
  };

  const flipGravityIfDue = async () => {
    const movesPlayed = level.moves - live.current.movesLeft;
    const next = gravityAfter(level.gravityFlips, movesPlayed);
    if (next === live.current.gravity) return;
    live.current.gravity = next;
    setGravity(next);
    spawnEffects([createVortexEffect(next)], VORTEX_MS);
    await wait(VORTEX_MS);
  };

  const settle = async () => {
    if (live.current.goals.every((goal) => goal.remaining === 0)) {
      setStars(computeStars(live.current.movesLeft, level.moves));
      await finale();
      setLive({ status: 'won', busy: false });
      return;
    }
    if (live.current.movesLeft === 0) {
      setLive({ status: 'lost', busy: false });
      return;
    }
    await flipGravityIfDue();
    setLive({ busy: false });
  };

  const play = async (plan: Plan) => {
    setLive({ movesLeft: live.current.movesLeft - 1 });
    if (plan.converted) {
      commit();
      await wait(CONVERT_MS);
    }
    await cascade(plan);
    await settle();
  };

  const swap = async (from: Pos, to: Pos) => {
    const engineBoard = session.board;
    if (!canAct() || !areAdjacent(from, to)) return;
    if (!engineBoard.tiles[from.r]?.[from.c] || !engineBoard.tiles[to.r]?.[to.c]) return;

    setLive({ busy: true });
    swapTiles(engineBoard, from, to);
    commit();
    await wait(SWAP_MS);

    const plan = resolveSwap(engineBoard, from, to, session.rng);
    if (plan) {
      await play(plan);
      return;
    }
    swapTiles(engineBoard, from, to);
    commit();
    await wait(SWAP_MS);
    setLive({ busy: false });
  };

  const activate = async (pos: Pos) => {
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
    stars,
    gravity,
    speed,
    movesToFlip: movesUntilFlip(level.gravityFlips, level.moves - movesLeft),
    score,
    bonus,
    swap,
    activate,
    hint,
  };
};
