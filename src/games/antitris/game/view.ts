import { dropDistance, shifted } from './engine';
import { colorOf, pieceCells } from './pieces';
import type { Board, Piece } from './types';

export type ViewCell = { color: number; ghost: boolean };

export const viewCells = (board: Board, piece: Piece | null): ViewCell[][] => {
  const cells = board.map((row) => row.map((color) => ({ color, ghost: false })));
  if (!piece) return cells;
  const landed = shifted(piece, dropDistance(board, piece), 0);
  pieceCells(landed).forEach(({ r, c }) => {
    cells[r][c] = { color: colorOf(piece.kind), ghost: true };
  });
  pieceCells(piece).forEach(({ r, c }) => {
    cells[r][c] = { color: colorOf(piece.kind), ghost: false };
  });
  return cells;
};
