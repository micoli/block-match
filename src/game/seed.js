const ADJECTIVES = ['royal', 'golden', 'brave', 'sunny', 'swift', 'lucky', 'noble', 'happy', 'shiny', 'mighty'];
const NOUNS = ['castle', 'crown', 'knight', 'dragon', 'garden', 'tower', 'jewel', 'throne', 'banner', 'forest'];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const randomSeed = () => `${pick(ADJECTIVES)}-${pick(NOUNS)}-${Math.floor(Math.random() * 1000)}`;
