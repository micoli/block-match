import type { GameDefinition } from '../shared/types';
import BlockMatchApp from './block-match/BlockMatchApp';
import AntitrisApp from './antitris/AntitrisApp';

export const GAMES: GameDefinition[] = [
  { id: 'block-match', title: 'Block Match', Component: BlockMatchApp },
  { id: 'antitris', title: 'Antitris', Component: AntitrisApp },
];
