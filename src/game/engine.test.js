import { describe, expect, it } from 'vitest';
import { applyClear, applyGravity, createBoard, findMatches, hasPossibleMove, isFillable, planClear } from './engine.js';
import { generateLevel } from './levelGenerator.js';

const colorsOf = (board) => board.tiles.map((row) => row.map((tile) => tile?.color ?? null));

describe('generateLevel', () => {
  it('generates identical levels for the same seed and number', () => {
    expect(generateLevel('royal', 12)).toEqual(generateLevel('royal', 12));
  });

  it('generates different levels for different seeds', () => {
    expect(generateLevel('royal', 12)).not.toEqual(generateLevel('crown', 12));
  });

  it('always has at least one goal and a move budget', () => {
    for (let number = 1; number <= 100; number++) {
      const level = generateLevel('check', number);
      expect(level.goals.length).toBeGreaterThan(0);
      expect(level.moves).toBeGreaterThanOrEqual(10);
    }
  });
});

describe('createBoard', () => {
  it('produces the same starting board for the same level', () => {
    const level = generateLevel('royal', 7);
    expect(colorsOf(createBoard(level).board)).toEqual(colorsOf(createBoard(level).board));
  });

  it('starts without matches and with a playable move', () => {
    for (let number = 1; number <= 50; number++) {
      const { board } = createBoard(generateLevel('check', number));
      expect(findMatches(board)).toHaveLength(0);
      expect(hasPossibleMove(board)).toBe(true);
    }
  });
});

describe('cascade', () => {
  it('refills every reachable cell deterministically', () => {
    const run = () => {
      const { board, rng } = createBoard(generateLevel('royal', 20));
      const plan = planClear(board, { activations: [{ r: 3, c: 3, type: 'bomb' }] });
      applyClear(board, plan);
      applyGravity(board, rng);
      return board;
    };
    const board = run();
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        if (isFillable(board, r, c)) expect(board.tiles[r][c]).not.toBeNull();
      }
    }
    expect(colorsOf(board)).toEqual(colorsOf(run()));
  });
});
