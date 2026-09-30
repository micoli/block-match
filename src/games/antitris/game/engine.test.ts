import { describe, expect, it } from 'vitest';
import { COLS, ROWS, clearLines, collides, createBoard, dropDistance, tryRotate } from './engine';
import { KINDS, pieceCells, shapeOf, spawnPiece } from './pieces';

describe('pieces', () => {
  it('has four cells in every rotation of every kind', () => {
    KINDS.forEach((kind) => {
      for (let rotation = 0; rotation < 4; rotation++) {
        expect(pieceCells({ kind, rotation, r: 0, c: 0 })).toHaveLength(4);
      }
    });
  });

  it('rotates clockwise', () => {
    expect(shapeOf('J', 1)).toEqual([
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ]);
  });

  it('spawns inside the board, touching the top row', () => {
    KINDS.forEach((kind) => {
      const cells = pieceCells(spawnPiece(kind, COLS));
      expect(Math.min(...cells.map(({ r }) => r))).toBe(0);
      expect(collides(createBoard(), spawnPiece(kind, COLS))).toBe(false);
    });
  });
});

describe('engine', () => {
  it('drops a piece down to the floor', () => {
    const piece = spawnPiece('O', COLS);
    expect(dropDistance(createBoard(), piece)).toBe(ROWS - 2);
  });

  it('stops a piece on the stack', () => {
    const board = createBoard();
    board[ROWS - 1][4] = 1;
    board[ROWS - 1][5] = 1;
    expect(dropDistance(board, spawnPiece('O', COLS))).toBe(ROWS - 3);
  });

  it('removes full lines and keeps the rest', () => {
    const board = createBoard();
    board[ROWS - 1] = Array<number>(COLS).fill(1);
    board[ROWS - 2] = Array<number>(COLS).fill(1);
    board[ROWS - 3][0] = 2;
    const result = clearLines(board);
    expect(result.cleared).toBe(2);
    expect(result.board[ROWS - 1][0]).toBe(2);
    expect(result.board).toHaveLength(ROWS);
  });

  it('kicks a rotation away from the wall', () => {
    const vertical = { ...spawnPiece('I', COLS), rotation: 1, r: 0, c: -2 };
    expect(collides(createBoard(), vertical)).toBe(false);
    const rotated = tryRotate(createBoard(), vertical, 1);
    expect(rotated?.rotation).toBe(2);
    expect(rotated?.c).toBe(0);
  });
});
