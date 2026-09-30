import type { ComponentType } from 'react';

export type GameProps = { seed: string; onHome: () => void };

export type GameDefinition = {
  id: string;
  title: string;
  Component: ComponentType<GameProps>;
};
