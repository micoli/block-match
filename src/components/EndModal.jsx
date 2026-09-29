import Stars from './Stars.jsx';

const EndModal = ({ status, stars, onNext, onRetry, onExit }) => (
  <div className="modal-backdrop">
    <div className="modal">
      {status === 'won' ? (
        <>
          <h2>Niveau réussi !</h2>
          <Stars count={stars} size="lg" />
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
