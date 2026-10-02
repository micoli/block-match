import { useEffect, useState } from 'react';
import type { Level, Move, SolutionStep } from '../game/types';
import { useGame } from '../hooks/useGame';
import { useTapCounter } from '../hooks/useTapCounter';
import Board from './Board';
import EndModal from './EndModal';
import Hud from './Hud';
import SolutionModal from './SolutionModal';

const HINT_DELAY_MS = 5000;
const SOLUTION_TAPS = 6;

type Props = {
  level: Level;
  seed: string;
  gravityEnabled: boolean;
  tryHard: boolean;
  levelNumber: number;
  baseScore: number;
  onWin: (levelNumber: number, stars: number, points: number) => void;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
};

const GamePlay = ({ level, seed, gravityEnabled, tryHard, levelNumber, baseScore, onWin, onNext, onRetry, onExit }: Props) => {
  const game = useGame(level, gravityEnabled);
  const [hint, setHint] = useState<Move | null>(null);
  const [startScore] = useState(baseScore);
  const [solution, setSolution] = useState<{ steps: SolutionStep[] | null } | null>(null);
  const onMovesTap = useTapCounter(SOLUTION_TAPS, () => setSolution({ steps: game.threeStarSolution() }));

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
      <Hud seed={seed} levelNumber={levelNumber} movesLeft={game.movesLeft} goals={game.goals} gravityEnabled={gravityEnabled} gravity={game.gravity} movesToFlip={game.movesToFlip} score={game.score} totalScore={startScore + game.score} onExit={onExit} onRestart={onRetry} onMovesTap={onMovesTap} />
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
      {solution && <SolutionModal steps={solution.steps} onClose={() => setSolution(null)} />}
      {game.status !== 'playing' && (
        <EndModal
          status={game.status}
          stars={game.stars}
          score={game.score}
          bonus={game.bonus}
          tryHard={tryHard}
          onNext={onNext}
          onRetry={onRetry}
          onExit={onExit}
        />
      )}
    </main>
  );
};

export default GamePlay;
