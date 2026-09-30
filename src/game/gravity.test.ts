import { describe, expect, it } from 'vitest';
import { createGravityFlips, gravityAfter, movesUntilFlip } from './gravity';

describe('gravity schedule', () => {
  it('flips every 5 to 10 moves, deterministically', () => {
    const flips = createGravityFlips('royal', 3);
    expect(createGravityFlips('royal', 3)).toEqual(flips);
    flips.forEach((flip, i) => {
      const gap = flip - (flips[i - 1] ?? 0);
      expect(gap).toBeGreaterThanOrEqual(5);
      expect(gap).toBeLessThanOrEqual(10);
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
