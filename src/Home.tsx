import { useState } from 'react';
import { GAMES } from './games/registry';
import { randomSeed } from './shared/seed';

type Props = { seed: string; onStart: (gameId: string, seed: string) => void };

const Home = ({ seed, onStart }: Props) => {
  const [value, setValue] = useState(seed);

  const start = (gameId: string) => onStart(gameId, value.trim() || randomSeed());

  return (
    <main className="screen menu">
      <h1 className="menu__title">
        Gravity <span>Games</span>
      </h1>
      <p className="menu__subtitle">Même seed, mêmes niveaux, mêmes tirages.</p>
      <form className="menu__form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="seed">Seed</label>
        <div className="menu__row">
          <input id="seed" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" />
          <button type="button" className="icon-button" onClick={() => setValue(randomSeed())} aria-label="Seed aléatoire">
            🎲
          </button>
        </div>
        <div className="menu__games">
          {GAMES.map((game) => (
            <button key={game.id} type="button" className="button" onClick={() => start(game.id)}>
              {game.title}
            </button>
          ))}
        </div>
      </form>
    </main>
  );
};

export default Home;
