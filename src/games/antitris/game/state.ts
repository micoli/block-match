import { COLS, clearLines, collides, createBoard, dropDistance, mergePiece, shifted, tryRotate } from './engine';
import { colorOf, spawnPiece } from './pieces';
import { drawFromBag, randomInt } from './random';
import { HARD_DROP_POINTS_PER_ROW, levelFor, lineClearPoints } from './scoring';
import type { GameState } from './types';

export const FLIP_MIN_PIECES = 3;
export const FLIP_MAX_PIECES = 6;

export type Action =
  | { type: 'tick' }
  | { type: 'move'; dx: -1 | 1 }
  | { type: 'rotate' }
  | { type: 'hardDrop' }
  | { type: 'restart'; seed: number };

export const createGame = (initialSeed: number): GameState => {
  const first = drawFromBag([], initialSeed);
  const second = drawFromBag(first.bag, first.seed);
  const [interval, seed] = randomInt(second.seed, FLIP_MIN_PIECES, FLIP_MAX_PIECES);
  return {
    board: createBoard(),
    piece: spawnPiece(first.kind, COLS),
    next: second.kind,
    bag: second.bag,
    seed,
    score: 0,
    lines: 0,
    placed: 0,
    flipAt: interval,
    flips: 0,
    gravity: 'down',
    status: 'playing',
    lastClear: null,
  };
};

const lockPiece = (state: GameState, bonusPoints = 0): GameState => {
  const merged = mergePiece(state.board, state.piece, colorOf(state.piece.kind));
  const { board, cleared } = clearLines(merged);
  const lines = state.lines + cleared;
  const points = lineClearPoints(cleared, levelFor(lines));
  const placed = state.placed + 1;
  const flipping = placed >= state.flipAt;
  const [interval, seed] = flipping
    ? randomInt(state.seed, FLIP_MIN_PIECES, FLIP_MAX_PIECES)
    : [0, state.seed];
  const drawn = drawFromBag(state.bag, seed);
  const piece = spawnPiece(state.next, COLS);

  return {
    ...state,
    board,
    piece,
    next: drawn.kind,
    bag: drawn.bag,
    seed: drawn.seed,
    score: state.score + bonusPoints + points,
    lines,
    placed,
    flipAt: flipping ? placed + interval : state.flipAt,
    flips: flipping ? state.flips + 1 : state.flips,
    gravity: flipping ? (state.gravity === 'down' ? 'up' : 'down') : state.gravity,
    status: collides(board, piece) ? 'over' : 'playing',
    lastClear: cleared ? { id: (state.lastClear?.id ?? 0) + 1, lines: cleared, points } : state.lastClear,
  };
};

export const reduce = (state: GameState, action: Action): GameState => {
  if (action.type === 'restart') return createGame(action.seed);
  if (state.status !== 'playing') return state;

  switch (action.type) {
    case 'tick': {
      const moved = shifted(state.piece, 1, 0);
      if (collides(state.board, moved)) return lockPiece(state);
      return { ...state, piece: moved };
    }
    case 'move': {
      const moved = shifted(state.piece, 0, action.dx);
      if (collides(state.board, moved)) return state;
      return { ...state, piece: moved };
    }
    case 'rotate': {
      // The mirrored board reverses the visual rotation sense.
      const rotated = tryRotate(state.board, state.piece, state.gravity === 'up' ? -1 : 1);
      if (!rotated) return state;
      return { ...state, piece: rotated };
    }
    case 'hardDrop': {
      const distance = dropDistance(state.board, state.piece);
      const dropped = { ...state, piece: shifted(state.piece, distance, 0) };
      return lockPiece(dropped, distance * HARD_DROP_POINTS_PER_ROW);
    }
  }
};
