import { useEffect, useState } from 'react';
import GameScreen from './components/GameScreen.jsx';
import LevelMap from './components/LevelMap.jsx';
import SeedMenu from './components/SeedMenu.jsx';
import { loadLastSeed, loadProgress, saveLastSeed, saveLevelResult } from './game/progress.js';
import { randomSeed } from './game/seed.js';

const readUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return { seed: params.get('seed'), level: Number(params.get('level')) || null };
};

const initialScreen = ({ seed, level }) => {
  if (!seed) return 'menu';
  return level ? 'game' : 'map';
};

const App = () => {
  const [initial] = useState(readUrlParams);
  const [seed, setSeed] = useState(() => initial.seed ?? loadLastSeed() ?? randomSeed());
  const [screen, setScreen] = useState(() => initialScreen(initial));
  const [levelNumber, setLevelNumber] = useState(initial.level ?? 1);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress(seed));

  useEffect(() => {
    if (screen === 'menu') {
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    const params = new URLSearchParams({ seed });
    if (screen === 'game') params.set('level', levelNumber);
    window.history.replaceState(null, '', `?${params}`);
  }, [seed, screen, levelNumber]);

  const chooseSeed = (nextSeed) => {
    setSeed(nextSeed);
    saveLastSeed(nextSeed);
    setProgress(loadProgress(nextSeed));
    setScreen('map');
  };

  const play = (number) => {
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
      onWin={(number, stars) => setProgress(saveLevelResult(seed, number, stars))}
      onNext={() => play(levelNumber + 1)}
      onRetry={() => play(levelNumber)}
      onExit={() => setScreen('map')}
    />
  );
};

export default App;
