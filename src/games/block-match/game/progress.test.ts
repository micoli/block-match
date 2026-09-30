import { describe, expect, it } from 'vitest';
import { decodeProgress, encodeProgress } from './progress';

describe('progress url encoding', () => {
  it('round-trips unlocked level and stars', () => {
    const progress = { unlocked: 4, stars: { 1: 3, 2: 1, 3: 2 }, score: 12340 };
    expect(decodeProgress(encodeProgress(progress))).toEqual(progress);
  });

  it('rejects malformed values', () => {
    expect(decodeProgress('not-base64!!')).toBeNull();
    expect(decodeProgress(btoa('{"u":0,"s":"9"}'))).toBeNull();
  });
});
