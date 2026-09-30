import type { Progress } from './types';

const PREFIX = 'block-match';

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): progress is simply not persisted
  }
};

const progressKey = (seed: string) => `${PREFIX}:progress:${seed}`;

export const loadProgress = (seed: string): Progress => ({
  unlocked: 1,
  stars: {},
  score: 0,
  ...readJson<Partial<Progress>>(progressKey(seed), {}),
});

export const saveLevelResult = (seed: string, levelNumber: number, stars: number, points: number) => {
  const progress = loadProgress(seed);
  const next: Progress = {
    unlocked: Math.max(progress.unlocked, levelNumber + 1),
    stars: { ...progress.stars, [levelNumber]: Math.max(progress.stars[levelNumber] ?? 0, stars) },
    score: progress.score + points,
  };
  writeJson(progressKey(seed), next);
  return next;
};

export const loadLastSeed = () => readJson<string | null>(`${PREFIX}:last-seed`, null);

export const saveLastSeed = (seed: string) => writeJson(`${PREFIX}:last-seed`, seed);

export const totalStars = (progress: Progress) => Object.values(progress.stars).reduce((sum, count) => sum + count, 0);

export const encodeProgress = (progress: Progress) => {
  const reached = progress.unlocked;
  const stars = Array.from({ length: reached }, (_, i) => progress.stars[i + 1] ?? 0).join('');
  const json = JSON.stringify({ u: reached, s: stars, t: totalStars(progress), g: progress.score });
  return btoa(json).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
};

export const decodeProgress = (encoded: string): Progress | null => {
  try {
    const json = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
    const { u, s, g = 0 } = JSON.parse(json);
    if (!Number.isInteger(u) || u < 1 || typeof s !== 'string' || !/^[0-3]*$/.test(s)) return null;
    if (!Number.isInteger(g) || g < 0) return null;
    const stars: Progress['stars'] = {};
    [...s].forEach((count, i) => {
      if (count !== '0') stars[i + 1] = Number(count);
    });
    return { unlocked: u, stars, score: g };
  } catch {
    return null;
  }
};

export const mergeProgress = (a: Progress, b: Progress): Progress => {
  const stars = { ...a.stars };
  Object.entries(b.stars).forEach(([level, count]) => {
    stars[Number(level)] = Math.max(stars[Number(level)] ?? 0, count);
  });
  return { unlocked: Math.max(a.unlocked, b.unlocked), stars, score: Math.max(a.score, b.score) };
};

export const importProgress = (seed: string, shared: Progress) => {
  const merged = mergeProgress(loadProgress(seed), shared);
  writeJson(progressKey(seed), merged);
  return merged;
};
