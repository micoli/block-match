export const NEIGHBORS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export const createGrid = (rows, cols, value) =>
  Array.from({ length: rows }, () => Array(cols).fill(value));

export const cellKey = (r, c) => `${r},${c}`;

export const inBounds = (board, r, c) => r >= 0 && r < board.rows && c >= 0 && c < board.cols;

export const rowCells = (board, r) => Array.from({ length: board.cols }, (_, c) => ({ r, c }));

export const colCells = (board, c) => Array.from({ length: board.rows }, (_, r) => ({ r, c }));

export const allCells = (board) =>
  Array.from({ length: board.rows }, (_, r) => rowCells(board, r)).flat();

export const squareCells = (r, c, radius) => {
  const cells = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) cells.push({ r: r + dr, c: c + dc });
  }
  return cells;
};

export const setMirrored = (grid, r, c, value) => {
  grid[r][c] = value;
  grid[r][grid[r].length - 1 - c] = value;
};
