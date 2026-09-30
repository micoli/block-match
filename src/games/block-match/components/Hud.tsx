import type { GoalProgress, Gravity } from '../game/types';
import GoalItem from './GoalItem';

type Props = {
  seed: string;
  levelNumber: number;
  movesLeft: number;
  goals: GoalProgress[];
  gravity: Gravity;
  movesToFlip: number | null;
  score: number;
  totalScore: number;
  onExit: () => void;
  onRestart: () => void;
};

const Hud = ({ seed, levelNumber, movesLeft, goals, gravity, movesToFlip, score, totalScore, onExit, onRestart }: Props) => (
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
      <span className={`hud__gravity hud__gravity--${gravity}`} title="Gravité">
        {gravity === 'down' ? '⬇' : '⬆'} <small>{movesToFlip === null ? '' : `inversion dans ${movesToFlip}`}</small>
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
