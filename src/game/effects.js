let nextEffectId = 1;

const BEAMS = {
  rocketH: [{ dir: 'h', offset: 0 }],
  rocketV: [{ dir: 'v', offset: 0 }],
  cross: [
    { dir: 'h', offset: 0 },
    { dir: 'v', offset: 0 },
  ],
  bigCross: [-1, 0, 1].flatMap((offset) => [
    { dir: 'h', offset },
    { dir: 'v', offset },
  ]),
};

const SHOCK_RADIUS = { bomb: 2.5, bigBomb: 3.5 };

const LIGHTNING_TYPES = ['color', 'lightball'];

// Must run before the plan is applied: it reads the tiles about to be destroyed.
export const buildEffects = (board, plan) => {
  const effects = [];
  const add = (effect) => effects.push({ id: nextEffectId++, ...effect });

  plan.cleared.forEach(({ r, c }) => {
    const tile = board.tiles[r][c];
    if (tile) add({ kind: 'burst', r, c, color: tile.special ? 'special' : tile.color });
    if (board.ice[r][c] > 0) add({ kind: 'shatter', r, c, material: 'ice', broken: true });
  });

  plan.boxHits.forEach(({ r, c }) => {
    add({ kind: 'shatter', r, c, material: 'wood', broken: board.boxes[r][c] === 1 });
  });

  plan.blasts.forEach(({ r, c, type, cells }) => {
    (BEAMS[type] ?? []).forEach(({ dir, offset }) => {
      add({ kind: 'beam', dir, r: dir === 'h' ? r + offset : r, c: dir === 'v' ? c + offset : c, originR: r, originC: c });
    });
    if (SHOCK_RADIUS[type]) add({ kind: 'shockwave', r, c, radius: SHOCK_RADIUS[type] });
    if (type === 'all') add({ kind: 'shockwave', r, c, radius: Math.max(board.rows, board.cols) });
    if (LIGHTNING_TYPES.includes(type)) add({ kind: 'lightning', r, c, targets: cells });
  });

  return effects;
};
