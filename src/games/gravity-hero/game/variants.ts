export type LaneStage = { from: number; lanes: number[] };

export type Variant = {
  id: string;
  name: string;
  laneCount: number;
  stages: LaneStage[];
};

export const HERO: Variant = {
  id: 'gravity-hero',
  name: 'Hero',
  laneCount: 3,
  stages: [
    { from: 0, lanes: [0, 1] },
    { from: 10, lanes: [0, 1, 2] },
  ],
};

export const SUPER_HERO: Variant = {
  id: 'gravity-super-hero',
  name: 'Super-Hero',
  laneCount: 4,
  stages: [
    { from: 0, lanes: [1, 2] },
    { from: 10, lanes: [0, 1, 2] },
    { from: 40, lanes: [0, 1, 2, 3] },
  ],
};

export const activeLanes = (variant: Variant, time: number) =>
  variant.stages.filter((stage) => time >= stage.from).at(-1)?.lanes ?? variant.stages[0].lanes;
