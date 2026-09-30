import { useEffect, useState } from 'react';

const storageKey = (game: string, seed: string) => `${game}:best:${seed}`;

const readBest = (game: string, seed: string) => {
  try {
    return Number(localStorage.getItem(storageKey(game, seed))) || 0;
  } catch {
    return 0;
  }
};

export const useBestScore = (game: string, seed: string, score: number, finished: boolean) => {
  const [best, setBest] = useState(() => readBest(game, seed));

  useEffect(() => {
    if (!finished || score <= best) return;
    setBest(score);
    try {
      localStorage.setItem(storageKey(game, seed), String(score));
    } catch {
      // storage unavailable: best score is simply not persisted
    }
  }, [game, seed, finished, score, best]);

  return best;
};
