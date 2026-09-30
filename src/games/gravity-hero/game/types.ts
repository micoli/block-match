export const LANES = 4;

export type Gravity = 'down' | 'up';
export type NoteKind = 'eighth' | 'quarter' | 'half';
export type NoteStatus = 'pending' | 'holding';
export type JudgmentType = 'perfect' | 'good' | 'miss';

export type Note = {
  id: number;
  lane: number;
  kind: NoteKind;
  time: number;
  duration: number;
  status: NoteStatus;
};

export type Judgment = { id: number; lane: number; type: JudgmentType };

export type Chart = {
  cursor: number;
  seed: number;
  nextId: number;
  busyUntil: number[];
};

export type GameState = {
  status: 'playing' | 'over';
  time: number;
  notes: Note[];
  chart: Chart;
  gravity: Gravity;
  flips: number;
  flipSeed: number;
  nextFlipAt: number;
  score: number;
  combo: number;
  perfectStreak: number;
  bestCombo: number;
  hits: number;
  misses: number;
  judgment: Judgment | null;
};

export type Action =
  | { type: 'tick'; dt: number }
  | { type: 'press'; lane: number }
  | { type: 'release'; lane: number }
  | { type: 'restart'; seed: number };
