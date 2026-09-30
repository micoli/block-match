import type { ComponentType } from 'react';
import BlockMatchApp from './games/block-match/BlockMatchApp';
import { DEFAULT_GAME_ID, readGameId } from './games/url';

const GAMES: Record<string, ComponentType> = {
  'block-match': BlockMatchApp,
};

const App = () => {
  const Game = GAMES[readGameId()] ?? GAMES[DEFAULT_GAME_ID];
  return <Game />;
};

export default App;
