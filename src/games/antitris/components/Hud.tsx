import { LINE_CLEAR_LABELS } from '../game/scoring';
import type { GameState } from '../game/types';
import NextPiece from './NextPiece';

type Props = { state: GameState; level: number; best: number };

const Hud = ({ state, level, best }: Props) => {
  const { score, lines, next, gravity, flipAt, placed, lastClear } = state;
  return (
    <header className="ft-hud">
      <div className="ft-hud__stats">
        <span>
          Score <strong>{score.toLocaleString('fr-FR')}</strong>
        </span>
        <span>
          Record <strong>{Math.max(best, score).toLocaleString('fr-FR')}</strong>
        </span>
        <span>
          Niveau <strong>{level}</strong> · Lignes <strong>{lines}</strong>
        </span>
        <span className={`ft-hud__gravity ft-hud__gravity--${gravity}`}>
          {gravity === 'down' ? '⬇' : '⬆'} <small>inversion dans {flipAt - placed}</small>
        </span>
      </div>
      <div className="ft-hud__next">
        <small>Suivante</small>
        <NextPiece kind={next} />
      </div>
      {lastClear && (
        <p key={lastClear.id} className="ft-hud__clear">
          {LINE_CLEAR_LABELS[lastClear.lines]} +{lastClear.points}
        </p>
      )}
    </header>
  );
};

export default Hud;
