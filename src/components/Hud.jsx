import GoalItem from './GoalItem.jsx';

const Hud = ({ seed, levelNumber, movesLeft, goals, score, totalScore, onExit, onRestart }) => (
  <header className="hud">
    <div className="hud__top">
      <button className="icon-button" onClick={onExit} aria-label="Retour à la carte">
        ←
      </button>
      <div className="hud__title">
        <strong>Niveau {levelNumber}</strong>
        <small>seed : {seed}</small>
      </div>
      <button className="icon-button hud__restart" onClick={onRestart} aria-label="Recommencer le niveau" title="Recommencer le niveau">
        ↺
      </button>
    </div>
    <div className="hud__score">
      <span>
        Score <strong>{score}</strong>
      </span>
      <span>
        Total <strong>{totalScore}</strong>
      </span>
    </div>
    <div className="hud__panel">
      <div className="hud__moves">
        <span>{movesLeft}</span>
        <small>coups</small>
      </div>
      <ul className="hud__goals">
        {goals.map((goal, index) => (
          <GoalItem key={index} goal={goal} />
        ))}
      </ul>
    </div>
  </header>
);

export default Hud;
