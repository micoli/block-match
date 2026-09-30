import type { Progress } from '../game/types';
import { totalStars } from '../game/progress';
import Stars from './Stars';

const LEVELS_AHEAD = 11;

type Props = {
  seed: string;
  progress: Progress;
  onPlay: (levelNumber: number) => void;
  onChangeSeed: () => void;
};

const LevelMap = ({ seed, progress, onPlay, onChangeSeed }: Props) => {
  const count = progress.unlocked + LEVELS_AHEAD;

  return (
    <main className="screen">
      <header className="map__header">
        <button className="icon-button" onClick={onChangeSeed} aria-label="Retour à l'accueil">
          ←
        </button>
        <div>
          <h1>Carte</h1>
          <small>seed : {seed}</small>
        </div>
      </header>
      <section className="map__score" aria-label="Score total">
        <small>Score total</small>
        <strong>{progress.score.toLocaleString('fr-FR')}</strong>
        <span>
          Niveau {progress.unlocked} · ★ {totalStars(progress)}
        </span>
      </section>
      <ol className="map__grid">
        {Array.from({ length: count }, (_, i) => i + 1).map((number) => {
          const locked = number > progress.unlocked;
          return (
            <li key={number}>
              <button
                className={`level-button ${locked ? 'level-button--locked' : ''} ${number === progress.unlocked ? 'level-button--current' : ''}`}
                disabled={locked}
                onClick={() => onPlay(number)}
              >
                <span>{locked ? '🔒' : number}</span>
                {!locked && <Stars count={progress.stars[number] ?? 0} size="sm" />}
              </button>
            </li>
          );
        })}
      </ol>
    </main>
  );
};

export default LevelMap;
