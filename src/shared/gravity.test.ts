import { describe, expect, it } from 'vitest';
import { withAntigravBonus } from './gravity';

describe('withAntigravBonus', () => {
  it('adds 25% only while anti-gravity is active', () => {
    expect(withAntigravBonus(100, true)).toBe(125);
    expect(withAntigravBonus(100, false)).toBe(100);
    expect(withAntigravBonus(50, true)).toBe(63);
  });
});
