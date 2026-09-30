import type { ComponentType } from 'react';

export type GameProps = { seed: string; gravityEnabled: boolean; onHome: () => void };

export type GameDefinition = {
  id: string;
  title: string;
  Component: ComponentType<GameProps>;
};
