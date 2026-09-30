import { useEffect, useState } from 'react';
import type { Level, Move } from '../game/types';
import { useGame } from '../hooks/useGame';
import Board from './Board';
import EndModal from './EndModal';
import Hud from './Hud';

const HINT_DELAY_MS = 5000;

type Props = {
  level: Level;
  seed: string;
  gravityEnabled: boolean;
  levelNumber: number;
  baseScore: number;
  onWin: (levelNumber: number, stars: number, points: number) => void;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
};

const GamePlay = ({ level, seed, gravityEnabled, levelNumber, baseScore, onWin, onNext, onRetry, onExit }: Props) => {
  const game = useGame(level, gravityEnabled);
  const [hint, setHint] = useState<Move | null>(null);
  const [startScore] = useState(baseScore);

  useEffect(() => {
    setHint(null);
    if (game.busy || game.status !== 'playing') return undefined;
    const timer = setTimeout(() => setHint(game.hint()), HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [game.board, game.busy, game.status]);

  useEffect(() => {
    if (game.status === 'won') onWin(levelNumber, game.stars, game.score);
  }, [game.status]);

  return (
    <main className="game">
      <Hud seed={seed} levelNumber={levelNumber} movesLeft={game.movesLeft} goals={game.goals} gravityEnabled={gravityEnabled} gravity={game.gravity} movesToFlip={game.movesToFlip} score={game.score} totalScore={startScore + game.score} onExit={onExit} onRestart={onRetry} />
      <Board
        board={game.board}
        hint={hint}
        effects={game.effects}
        gravity={game.gravity}
        speed={game.speed}
        disabled={game.busy || game.status !== 'playing'}
        onSwap={game.swap}
        onActivate={game.activate}
      />
      {game.status !== 'playing' && (
        <EndModal
          status={game.status}
          stars={game.stars}
          score={game.score}
          bonus={game.bonus}
          onNext={onNext}
          onRetry={onRetry}
          onExit={onExit}
        />
      )}
    </main>
  );
};

export default GamePlay;
