import { useEffect } from 'react';
import type { GameProps } from '../../shared/types';
import { buildGameUrl } from '../../shared/url';
import Board from './components/Board';
import GameOverModal from './components/GameOverModal';
import Hud from './components/Hud';
import { useBestScore } from './hooks/useBestScore';
import { useAntitris } from './hooks/useAntitris';
import './styles.css';

const GAME_ID = 'antitris';

const AntitrisApp = ({ seed, onHome }: GameProps) => {
  const { state, level, move, rotate, hardDrop, restart } = useAntitris(seed);
  const over = state.status === 'over';
  const best = useBestScore(seed, state.score, over);

  useEffect(() => {
    window.history.replaceState(null, '', buildGameUrl(GAME_ID, { seed }));
  }, [seed]);

  return (
    <main className="ft-game">
      <div className="ft-top">
        <button className="ft-back" onClick={onHome} aria-label="Retour à l'accueil">
          ←
        </button>
        <div className="ft-top__title">
          <h1>
            Anti<span>tris</span>
          </h1>
          <small>seed : {seed}</small>
        </div>
        <button className="ft-back" onClick={restart} aria-label="Recommencer" title="Recommencer">
          ↺
        </button>
      </div>
      <Hud state={state} level={level} best={best} />
      <Board
        board={state.board}
        piece={state.piece}
        gravity={state.gravity}
        flips={state.flips}
        onMove={move}
        onRotate={rotate}
        onHardDrop={hardDrop}
      />
      <p className="ft-help">Tap : tourner · Glisser ← → : déplacer · Glisser vers la chute : poser</p>
      {over && <GameOverModal score={state.score} best={best} onRestart={restart} />}
    </main>
  );
};

export default AntitrisApp;
