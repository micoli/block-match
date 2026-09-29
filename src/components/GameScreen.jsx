import { useEffect, useMemo, useState } from 'react';
import { generateLevel } from '../game/levelGenerator.js';
import { useGame } from '../hooks/useGame.js';
import Board from './Board.jsx';
import EndModal from './EndModal.jsx';
import Hud from './Hud.jsx';

const HINT_DELAY_MS = 5000;

const GameScreen = ({ seed, levelNumber, onWin, onNext, onRetry, onExit }) => {
  const level = useMemo(() => generateLevel(seed, levelNumber), [seed, levelNumber]);
  const game = useGame(level);
  const [hint, setHint] = useState(null);

  useEffect(() => {
    setHint(null);
    if (game.busy || game.status !== 'playing') return undefined;
    const timer = setTimeout(() => setHint(game.hint()), HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [game.board, game.busy, game.status]);

  useEffect(() => {
    if (game.status === 'won') onWin(levelNumber, game.stars);
  }, [game.status]);

  return (
    <main className="game">
      <Hud seed={seed} levelNumber={levelNumber} movesLeft={game.movesLeft} goals={game.goals} onExit={onExit} />
      <Board
        board={game.board}
        hint={hint}
        effects={game.effects}
        disabled={game.busy || game.status !== 'playing'}
        onSwap={game.swap}
        onActivate={game.activate}
      />
      {game.status !== 'playing' && (
        <EndModal status={game.status} stars={game.stars} onNext={onNext} onRetry={onRetry} onExit={onExit} />
      )}
    </main>
  );
};

export default GameScreen;
