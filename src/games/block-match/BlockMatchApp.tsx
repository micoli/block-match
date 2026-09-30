import { useEffect, useState } from 'react';
import type { GameProps } from '../../shared/types';
import { buildGameUrl } from '../../shared/url';
import GameScreen from './components/GameScreen';
import LevelMap from './components/LevelMap';
import { decodeProgress, encodeProgress, importProgress, loadProgress, saveLevelResult } from './game/progress';
import './styles.css';

const GAME_ID = 'block-match';

const readUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('p');
  return {
    level: Number(params.get('level')) || null,
    shared: shared ? decodeProgress(shared) : null,
  };
};

type Screen = 'map' | 'game';

const BlockMatchApp = ({ seed, onHome }: GameProps) => {
  const [initial] = useState(readUrlParams);
  const [screen, setScreen] = useState<Screen>(initial.level ? 'game' : 'map');
  const [levelNumber, setLevelNumber] = useState(initial.level ?? 1);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(() => (initial.shared ? importProgress(seed, initial.shared) : loadProgress(seed)));

  useEffect(() => {
    const params: Record<string, string> = { seed, p: encodeProgress(progress) };
    if (screen === 'game') params.level = String(levelNumber);
    window.history.replaceState(null, '', buildGameUrl(GAME_ID, params));
  }, [seed, screen, levelNumber, progress]);

  const play = (number: number) => {
    setLevelNumber(number);
    setAttempt((value) => value + 1);
    setScreen('game');
  };

  if (screen === 'map') {
    return <LevelMap seed={seed} progress={progress} onPlay={play} onChangeSeed={onHome} />;
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

export default BlockMatchApp;
