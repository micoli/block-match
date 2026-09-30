import type { Kind, Piece, Pos } from './types';

export const KINDS: Kind[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const BASES: Record<Kind, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const rotateClockwise = (matrix: number[][]) =>
  matrix.map((_, r) => matrix.map((__, c) => matrix[matrix.length - 1 - c][r]));

const buildRotations = (base: number[][]) => {
  const rotations = [base];
  for (let i = 1; i < 4; i++) rotations.push(rotateClockwise(rotations[i - 1]));
  return rotations;
};

const SHAPES = Object.fromEntries(KINDS.map((kind) => [kind, buildRotations(BASES[kind])])) as Record<
  Kind,
  number[][][]
>;

export const colorOf = (kind: Kind) => KINDS.indexOf(kind) + 1;

export const shapeOf = (kind: Kind, rotation = 0) => SHAPES[kind][((rotation % 4) + 4) % 4];

export const pieceCells = ({ kind, rotation, r, c }: Piece): Pos[] =>
  shapeOf(kind, rotation).flatMap((row, dr) =>
    row.flatMap((filled, dc) => (filled ? [{ r: r + dr, c: c + dc }] : [])),
  );

export const spawnPiece = (kind: Kind, cols: number): Piece => {
  const shape = shapeOf(kind);
  const firstRow = shape.findIndex((row) => row.some(Boolean));
  return { kind, rotation: 0, r: -firstRow, c: Math.floor((cols - shape.length) / 2) };
};
