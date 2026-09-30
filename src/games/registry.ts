import type { GameDefinition } from '../shared/types';
import BlockMatchApp from './block-match/BlockMatchApp';
import AntitrisApp from './antitris/AntitrisApp';
import GravityHeroApp from './gravity-hero/GravityHeroApp';

export const GAMES: GameDefinition[] = [
  { id: 'block-match', title: 'Block Match', Component: BlockMatchApp },
  { id: 'antitris', title: 'Antitris', Component: AntitrisApp },
  { id: 'gravity-hero', title: 'Gravity Hero', Component: GravityHeroApp },
];
