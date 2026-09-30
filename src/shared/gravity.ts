const ANTIGRAV_BONUS = 1.25;

export const withAntigravBonus = (points: number, antigravActive: boolean) =>
  antigravActive ? Math.round(points * ANTIGRAV_BONUS) : points;
