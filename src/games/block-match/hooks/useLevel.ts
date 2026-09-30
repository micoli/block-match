import { useEffect, useState } from 'react';
import { generateLevel } from '../game/levelGenerator';
import type { Level } from '../game/types';

const MIN_LOADER_MS = 500;

// Generation runs the solver synchronously: yield to the browser first so the loader is painted.
export const useLevel = (seed: string, levelNumber: number) => {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    setLevel(null);
    const startedAt = performance.now();
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = setTimeout(() => {
      const generated = generateLevel(seed, levelNumber);
      const remaining = Math.max(0, MIN_LOADER_MS - (performance.now() - startedAt));
      showTimer = setTimeout(() => setLevel(generated), remaining);
    }, 50);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(showTimer);
    };
  }, [seed, levelNumber]);

  return level;
};
