import { useState } from 'react';
import type { FormEvent } from 'react';
import { randomSeed } from '../game/seed';

type Props = { seed: string; onSubmit: (seed: string) => void };

const SeedMenu = ({ seed, onSubmit }: Props) => {
  const [value, setValue] = useState(seed);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value.trim() || randomSeed());
  };

  return (
    <main className="screen menu">
      <h1 className="menu__title">
        Block <span>Match</span>
      </h1>
      <p className="menu__subtitle">Même seed, mêmes niveaux, mêmes tirages.</p>
      <form className="menu__form" onSubmit={handleSubmit}>
        <label htmlFor="seed">Seed</label>
        <div className="menu__row">
          <input id="seed" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" />
          <button type="button" className="icon-button" onClick={() => setValue(randomSeed())} aria-label="Seed aléatoire">
            🎲
          </button>
        </div>
        <button type="submit" className="button">
          Jouer
        </button>
      </form>
    </main>
  );
};

export default SeedMenu;
