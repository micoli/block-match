import { useLevel } from '../hooks/useLevel.js';
import GamePlay from './GamePlay.jsx';
import LevelLoader from './LevelLoader.jsx';

const GameScreen = ({ seed, levelNumber, ...handlers }) => {
  const level = useLevel(seed, levelNumber);

  if (!level) return <LevelLoader levelNumber={levelNumber} onExit={handlers.onExit} />;

  return <GamePlay level={level} seed={seed} levelNumber={levelNumber} {...handlers} />;
};

export default GameScreen;
