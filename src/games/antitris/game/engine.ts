import { pieceCells } from './pieces';
import type { Board, Piece } from './types';

export const ROWS = 20;
export const COLS = 10;

const ROTATION_KICKS = [0, -1, 1, -2, 2];

export const createBoard = (): Board => Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));

export const collides = (board: Board, piece: Piece) =>
  pieceCells(piece).some(({ r, c }) => c < 0 || c >= COLS || r < 0 || r >= ROWS || board[r][c] !== 0);

export const shifted = (piece: Piece, dr: number, dc: number): Piece => ({ ...piece, r: piece.r + dr, c: piece.c + dc });

export const dropDistance = (board: Board, piece: Piece) => {
  let distance = 0;
  while (!collides(board, shifted(piece, distance + 1, 0))) distance++;
  return distance;
};

export const tryRotate = (board: Board, piece: Piece, direction: 1 | -1) => {
  const rotated = { ...piece, rotation: (piece.rotation + direction + 4) % 4 };
  for (const kick of ROTATION_KICKS) {
    const candidate = shifted(rotated, 0, kick);
    if (!collides(board, candidate)) return candidate;
  }
  return null;
};

export const mergePiece = (board: Board, piece: Piece, color: number): Board => {
  const merged = board.map((row) => [...row]);
  pieceCells(piece).forEach(({ r, c }) => {
    merged[r][c] = color;
  });
  return merged;
};

export const clearLines = (board: Board) => {
  const kept = board.filter((row) => row.some((value) => value === 0));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array<number>(COLS).fill(0));
  return { board: [...empty, ...kept], cleared };
};
