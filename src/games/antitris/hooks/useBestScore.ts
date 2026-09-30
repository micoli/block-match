import { useEffect, useState } from 'react';

const storageKey = (seed: string) => `antitris:best:${seed}`;

const readBest = (seed: string) => {
  try {
    return Number(localStorage.getItem(storageKey(seed))) || 0;
  } catch {
    return 0;
  }
};

export const useBestScore = (seed: string, score: number, finished: boolean) => {
  const [best, setBest] = useState(() => readBest(seed));

  useEffect(() => {
    if (!finished || score <= best) return;
    setBest(score);
    try {
      localStorage.setItem(storageKey(seed), String(score));
    } catch {
      // storage unavailable: best score is simply not persisted
    }
  }, [seed, finished, score, best]);

  return best;
};
