import { describe, expect, it } from 'vitest';
import { MAX_INTERVAL, MIN_INTERVAL, createGravityFlips, gravityAfter, movesUntilFlip } from './gravity';

describe('gravity schedule', () => {
  it('flips at regular random intervals, deterministically', () => {
    const flips = createGravityFlips('royal', 3);
    expect(createGravityFlips('royal', 3)).toEqual(flips);
    flips.forEach((flip, i) => {
      const gap = flip - (flips[i - 1] ?? 0);
      expect(gap).toBeGreaterThanOrEqual(MIN_INTERVAL);
      expect(gap).toBeLessThanOrEqual(MAX_INTERVAL);
    });
  });

  it('alternates direction after each flip', () => {
    const flips = [6, 13];
    expect(gravityAfter(flips, 5)).toBe('down');
    expect(gravityAfter(flips, 6)).toBe('up');
    expect(gravityAfter(flips, 13)).toBe('down');
    expect(movesUntilFlip(flips, 4)).toBe(2);
  });
});
