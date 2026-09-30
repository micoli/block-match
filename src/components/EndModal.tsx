import type { GameStatus } from '../game/types';
import Stars from './Stars';

type Props = {
  status: GameStatus;
  stars: number;
  score: number;
  bonus: number;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
};

const EndModal = ({ status, stars, score, bonus, onNext, onRetry, onExit }: Props) => (
  <div className="modal-backdrop">
    <div className="modal">
      {status === 'won' ? (
        <>
          <h2>Niveau réussi !</h2>
          <Stars count={stars} size="lg" />
          <p className="modal__score">
            <strong>{score}</strong> points
            {bonus > 0 && <small> dont {bonus} de bonus</small>}
          </p>
          <button className="button" onClick={onNext}>
            Niveau suivant
          </button>
        </>
      ) : (
        <>
          <h2>Plus de coups…</h2>
          <p>Les objectifs ne sont pas atteints.</p>
          <button className="button" onClick={onRetry}>
            Réessayer
          </button>
        </>
      )}
      <button className="button button--secondary" onClick={onExit}>
        Carte
      </button>
    </div>
  </div>
);

export default EndModal;
