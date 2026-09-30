const LAST_SEED_KEY = 'games:last-seed';
const ADJECTIVES = ['royal', 'golden', 'brave', 'sunny', 'swift', 'lucky', 'noble', 'happy', 'shiny', 'mighty'];
const NOUNS = ['castle', 'crown', 'knight', 'dragon', 'garden', 'tower', 'jewel', 'throne', 'banner', 'forest'];

const pick = (items: string[]) => items[Math.floor(Math.random() * items.length)];

export const randomSeed = () => `${pick(ADJECTIVES)}-${pick(NOUNS)}-${Math.floor(Math.random() * 1000)}`;

export const hashSeed = (text: string) => {
  let h1 = 0xdeadbeef ^ text.length;
  let h2 = 0x41c6ce57 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return h1 >>> 0;
};

export const loadLastSeed = () => {
  try {
    return localStorage.getItem(LAST_SEED_KEY);
  } catch {
    return null;
  }
};

export const saveLastSeed = (seed: string) => {
  try {
    localStorage.setItem(LAST_SEED_KEY, seed);
  } catch {
    // storage unavailable: the last seed is simply not remembered
  }
};
