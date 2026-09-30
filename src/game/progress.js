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

export const loadProgress = (seed) => ({ unlocked: 1, stars: {}, score: 0, ...readJson(progressKey(seed), {}) });

export const saveLevelResult = (seed, levelNumber, stars, points) => {
  const progress = loadProgress(seed);
  const next = {
    unlocked: Math.max(progress.unlocked, levelNumber + 1),
    stars: { ...progress.stars, [levelNumber]: Math.max(progress.stars[levelNumber] ?? 0, stars) },
    score: progress.score + points,
  };
  writeJson(progressKey(seed), next);
  return next;
};

export const loadLastSeed = () => readJson(`${PREFIX}:last-seed`, null);

export const saveLastSeed = (seed) => writeJson(`${PREFIX}:last-seed`, seed);

export const totalStars = (progress) => Object.values(progress.stars).reduce((sum, count) => sum + count, 0);

export const encodeProgress = (progress) => {
  const reached = progress.unlocked;
  const stars = Array.from({ length: reached }, (_, i) => progress.stars[i + 1] ?? 0).join('');
  const json = JSON.stringify({ u: reached, s: stars, t: totalStars(progress), g: progress.score });
  return btoa(json).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
};

export const decodeProgress = (encoded) => {
  try {
    const json = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
    const { u, s, g = 0 } = JSON.parse(json);
    if (!Number.isInteger(u) || u < 1 || typeof s !== 'string' || !/^[0-3]*$/.test(s)) return null;
    if (!Number.isInteger(g) || g < 0) return null;
    const stars = {};
    [...s].forEach((count, i) => {
      if (count !== '0') stars[i + 1] = Number(count);
    });
    return { unlocked: u, stars, score: g };
  } catch {
    return null;
  }
};

export const mergeProgress = (a, b) => {
  const stars = { ...a.stars };
  Object.entries(b.stars).forEach(([level, count]) => {
    stars[level] = Math.max(stars[level] ?? 0, count);
  });
  return { unlocked: Math.max(a.unlocked, b.unlocked), stars, score: Math.max(a.score, b.score) };
};

export const importProgress = (seed, shared) => {
  const merged = mergeProgress(loadProgress(seed), shared);
  writeJson(progressKey(seed), merged);
  return merged;
};
