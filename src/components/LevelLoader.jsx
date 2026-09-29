const CELLS = 9;

const LevelLoader = ({ levelNumber, onExit }) => (
  <main className="loader" role="status" aria-live="polite">
    <button className="icon-button loader__exit" onClick={onExit} aria-label="Retour à la carte">
      ←
    </button>
    <div className="loader__grid" aria-hidden="true">
      {Array.from({ length: CELLS }, (_, i) => (
        <span key={i} className="loader__cell" style={{ '--i': i }} />
      ))}
    </div>
    <strong>Niveau {levelNumber}</strong>
    <small>Le solveur prépare le niveau…</small>
  </main>
);

export default LevelLoader;
