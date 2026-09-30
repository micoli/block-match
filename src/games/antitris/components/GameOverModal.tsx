type Props = { score: number; best: number; onRestart: () => void };

const GameOverModal = ({ score, best, onRestart }: Props) => (
  <div className="ft-modal-backdrop">
    <div className="ft-modal">
      <h2>Partie terminée</h2>
      <p>
        <strong>{score.toLocaleString('fr-FR')}</strong> points
      </p>
      {score >= best && score > 0 && <p>Nouveau record !</p>}
      <button className="ft-button" onClick={onRestart}>
        Rejouer
      </button>
    </div>
  </div>
);

export default GameOverModal;
