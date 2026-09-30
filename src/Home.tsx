import { useState } from 'react';
import { GAMES } from './games/registry';
import { randomSeed } from './shared/seed';
import LanguageSwitcher from './i18n/LanguageSwitcher';
import { useI18n } from './i18n/useI18n';

type Props = { seed: string; onStart: (gameId: string, seed: string) => void };

const Home = ({ seed, onStart }: Props) => {
  const { t } = useI18n();
  const [value, setValue] = useState(seed);

  const start = (gameId: string) => onStart(gameId, value.trim() || randomSeed());

  return (
    <main className="screen menu">
      <LanguageSwitcher />
      <h1 className="menu__title">
        Gravity <span>Games</span>
      </h1>
      <p className="menu__subtitle">{t('home.subtitle')}</p>
      <form className="menu__form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="seed">{t('home.seedLabel')}</label>
        <div className="menu__row">
          <input id="seed" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" />
          <button
            type="button"
            className="icon-button"
            onClick={() => setValue(randomSeed())}
            aria-label={t('home.randomSeed')}
          >
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
