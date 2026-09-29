import { describe, expect, it } from 'vitest';
import { generateLevel } from './levelGenerator.js';
import { solve } from './solver.js';

describe('level winnability', () => {
  it('has a known winning sequence within the move budget', () => {
    for (let number = 1; number <= 60; number++) {
      const level = generateLevel('winnable', number);
      expect(solve(level, level.moves), `level ${number}`).not.toBeNull();
    }
  });
});
