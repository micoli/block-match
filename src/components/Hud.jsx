import GoalItem from './GoalItem.jsx';

const Hud = ({ seed, levelNumber, movesLeft, goals, onExit }) => (
  <header className="hud">
    <div className="hud__top">
      <button className="icon-button" onClick={onExit} aria-label="Retour à la carte">
        ←
      </button>
      <div className="hud__title">
        <strong>Niveau {levelNumber}</strong>
        <small>seed : {seed}</small>
      </div>
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
