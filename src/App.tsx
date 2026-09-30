import { useEffect, useState } from 'react';
import Home from './Home';
import { GAMES } from './games/registry';
import { loadLastSeed, randomSeed, saveLastSeed } from './shared/seed';
import { readRoute } from './shared/url';
import { useGravitySetting } from './shared/useGravitySetting';

const App = () => {
  const [initial] = useState(readRoute);
  const [seed, setSeed] = useState(() => initial.seed ?? loadLastSeed() ?? randomSeed());
  const [gameId, setGameId] = useState(() => GAMES.find((game) => game.id === initial.gameId)?.id ?? null);
  const [gravityEnabled, setGravityEnabled] = useGravitySetting();
  const game = GAMES.find(({ id }) => id === gameId);

  useEffect(() => {
    if (!game) window.history.replaceState(null, '', window.location.pathname);
  }, [game]);

  const start = (nextGameId: string, nextSeed: string) => {
    saveLastSeed(nextSeed);
    setSeed(nextSeed);
    setGameId(nextGameId);
  };

  if (!game) return <Home seed={seed} gravityEnabled={gravityEnabled} onGravityChange={setGravityEnabled} onStart={start} />;

  return <game.Component key={`${game.id}-${seed}`} seed={seed} gravityEnabled={gravityEnabled} onHome={() => setGameId(null)} />;
};

export default App;
