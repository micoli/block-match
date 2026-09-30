export type Kind = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Board = number[][];

export type Pos = { r: number; c: number };

export type Piece = { kind: Kind; rotation: number; r: number; c: number };

// 'up' means the board is displayed upside down: pieces visually rise.
export type Gravity = 'down' | 'up';

export type Status = 'playing' | 'over';

export type LineClear = { id: number; lines: number; points: number };

export type GameState = {
  board: Board;
  piece: Piece;
  next: Kind;
  bag: Kind[];
  seed: number;
  score: number;
  lines: number;
  placed: number;
  flipAt: number;
  flips: number;
  gravity: Gravity;
  status: Status;
  lastClear: LineClear | null;
};
