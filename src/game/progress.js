const PREFIX = 'block-match';

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): progress is simply not persisted
  }
};

const progressKey = (seed) => `${PREFIX}:progress:${seed}`;

export const loadProgress = (seed) => ({ unlocked: 1, stars: {}, ...readJson(progressKey(seed), {}) });

export const saveLevelResult = (seed, levelNumber, stars) => {
  const progress = loadProgress(seed);
  const next = {
    unlocked: Math.max(progress.unlocked, levelNumber + 1),
    stars: { ...progress.stars, [levelNumber]: Math.max(progress.stars[levelNumber] ?? 0, stars) },
  };
  writeJson(progressKey(seed), next);
  return next;
};

export const loadLastSeed = () => readJson(`${PREFIX}:last-seed`, null);

export const saveLastSeed = (seed) => writeJson(`${PREFIX}:last-seed`, seed);
