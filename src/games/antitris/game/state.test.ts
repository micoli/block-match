import { describe, expect, it } from 'vitest';
import { COLS, ROWS } from './engine';
import { FLIP_MAX_PIECES, FLIP_MIN_PIECES, createGame, reduce } from './state';
import { levelFor, tickInterval } from './scoring';
import { spawnPiece } from './pieces';
import { hashSeed } from '../../../shared/seed';
import type { Kind } from './types';

describe('flip schedule', () => {
  it('flips gravity every 3 to 6 placed pieces', () => {
    let state = createGame(42);
    const flipPoints: number[] = [];
    while (flipPoints.length < 4 && state.status === 'playing') {
      const flips = state.flips;
      state = reduce(state, { type: 'hardDrop' });
      if (state.flips !== flips) flipPoints.push(state.placed);
      if (state.board[0].some(Boolean)) break;
    }
    flipPoints.forEach((placed, i) => {
      const gap = placed - (flipPoints[i - 1] ?? 0);
      expect(gap).toBeGreaterThanOrEqual(FLIP_MIN_PIECES);
      expect(gap).toBeLessThanOrEqual(FLIP_MAX_PIECES);
    });
    expect(flipPoints.length).toBeGreaterThan(0);
  });

  it('alternates the view gravity at each flip', () => {
    let state = createGame(7);
    expect(state.gravity).toBe('down');
    while (state.flips === 0) state = reduce(state, { type: 'hardDrop' });
    expect(state.gravity).toBe('up');
  });
});

describe('gameplay', () => {
  it('moves, rotates and drops the active piece', () => {
    const state = createGame(1);
    const moved = reduce(state, { type: 'move', dx: -1 });
    expect(moved.piece.c).toBe(state.piece.c - 1);
    expect(reduce(state, { type: 'tick' }).piece.r).toBe(state.piece.r + 1);
    expect(reduce(state, { type: 'hardDrop' }).placed).toBe(1);
  });

  it('scores a Tetris with a bonus over single lines', () => {
    const state = createGame(1);
    const board = state.board.map((row) => [...row]);
    for (let r = ROWS - 4; r < ROWS; r++) board[r] = Array<number>(COLS).fill(1).map((v, c) => (c === 0 ? 0 : v));
    const piece = { ...spawnPiece('I', COLS), rotation: 1 };
    const prepared = { ...state, board, piece: { ...piece, c: -2 } };
    const result = reduce(prepared, { type: 'hardDrop' });
    expect(result.lastClear?.lines).toBe(4);
    expect(result.score).toBeGreaterThanOrEqual(800);
  });

  it('ends the game when a new piece cannot spawn', () => {
    const state = createGame(3);
    const board = state.board.map((row, r) => (r < 4 ? row.map((_, c) => (c === COLS - 1 ? 0 : 1)) : row));
    const blocked = reduce({ ...state, board }, { type: 'tick' });
    expect(blocked.status).toBe('over');
  });
});

describe('speed', () => {
  it('gets faster as the level rises, never below the minimum', () => {
    expect(tickInterval(2)).toBeLessThan(tickInterval(1));
    expect(tickInterval(50)).toBeGreaterThan(0);
    expect(levelFor(25)).toBe(3);
  });
});

describe('seed', () => {
  const play = (seed: string, dx: -1 | 1) => {
    let state = createGame(hashSeed(seed));
    const kinds: Kind[] = [state.piece.kind];
    const flips: number[] = [];
    for (let i = 0; i < 12 && state.status === 'playing'; i++) {
      state = reduce(reduce(state, { type: 'move', dx }), { type: 'hardDrop' });
      kinds.push(state.piece.kind);
      flips.push(state.flips);
    }
    return { kinds, flips };
  };

  it('gives the same pieces and flips whatever the player does', () => {
    expect(play('royal-castle-1', -1)).toEqual(play('royal-castle-1', 1));
  });

  it('gives different sequences for different seeds', () => {
    expect(play('royal-castle-1', 1).kinds).not.toEqual(play('golden-dragon-2', 1).kinds);
  });
});
