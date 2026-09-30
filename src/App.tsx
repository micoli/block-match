import { useEffect, useState } from 'react';
import GameScreen from './components/GameScreen';
import LevelMap from './components/LevelMap';
import SeedMenu from './components/SeedMenu';
import {
  decodeProgress,
  encodeProgress,
  importProgress,
  loadLastSeed,
  loadProgress,
  saveLastSeed,
  saveLevelResult,
} from './game/progress';
import { randomSeed } from './game/seed';

const readUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('p');
  return {
    seed: params.get('seed'),
    level: Number(params.get('level')) || null,
    shared: shared ? decodeProgress(shared) : null,
  };
};

type Screen = 'menu' | 'map' | 'game';

type UrlParams = ReturnType<typeof readUrlParams>;

const initialScreen = ({ seed, level }: UrlParams): Screen => {
  if (!seed) return 'menu';
  return level ? 'game' : 'map';
};

const App = () => {
  const [initial] = useState(readUrlParams);
  const [seed, setSeed] = useState(() => initial.seed ?? loadLastSeed() ?? randomSeed());
  const [screen, setScreen] = useState<Screen>(() => initialScreen(initial));
  const [levelNumber, setLevelNumber] = useState(initial.level ?? 1);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(() => (initial.shared ? importProgress(seed, initial.shared) : loadProgress(seed)));

  useEffect(() => {
    if (screen === 'menu') {
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    const params = new URLSearchParams({ seed, p: encodeProgress(progress) });
    if (screen === 'game') params.set('level', String(levelNumber));
    window.history.replaceState(null, '', `?${params}`);
  }, [seed, screen, levelNumber, progress]);

  const chooseSeed = (nextSeed: string) => {
    setSeed(nextSeed);
    saveLastSeed(nextSeed);
    setProgress(loadProgress(nextSeed));
    setScreen('map');
  };

  const play = (number: number) => {
    setLevelNumber(number);
    setAttempt((value) => value + 1);
    setScreen('game');
  };

  if (screen === 'menu') return <SeedMenu seed={seed} onSubmit={chooseSeed} />;

  if (screen === 'map') {
    return <LevelMap seed={seed} progress={progress} onPlay={play} onChangeSeed={() => setScreen('menu')} />;
  }

  return (
    <GameScreen
      key={`${seed}-${levelNumber}-${attempt}`}
      seed={seed}
      levelNumber={levelNumber}
      baseScore={progress.score}
      onWin={(number, stars, points) => setProgress(saveLevelResult(seed, number, stars, points))}
      onNext={() => play(levelNumber + 1)}
      onRetry={() => play(levelNumber)}
      onExit={() => setScreen('map')}
    />
  );
};

export default App;
