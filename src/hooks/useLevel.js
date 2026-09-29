import { useEffect, useState } from 'react';
import { generateLevel } from '../game/levelGenerator.js';

const MIN_LOADER_MS = 500;

// Generation runs the solver synchronously: yield to the browser first so the loader is painted.
export const useLevel = (seed, levelNumber) => {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    setLevel(null);
    const startedAt = performance.now();
    let showTimer;
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
