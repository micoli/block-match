import type { ComponentProps } from 'react';
import { useLevel } from '../hooks/useLevel';
import GamePlay from './GamePlay';
import LevelLoader from './LevelLoader';

type Props = Omit<ComponentProps<typeof GamePlay>, 'level'>;

const GameScreen = ({ seed, gravityEnabled, levelNumber, ...handlers }: Props) => {
  const level = useLevel(seed, levelNumber);

  if (!level) return <LevelLoader levelNumber={levelNumber} onExit={handlers.onExit} />;

  return <GamePlay level={level} seed={seed} gravityEnabled={gravityEnabled} levelNumber={levelNumber} {...handlers} />;
};

export default GameScreen;
