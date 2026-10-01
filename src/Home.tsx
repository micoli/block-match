import { useState } from 'react';
import { GAMES } from './games/registry';
import { randomSeed } from './shared/seed';
import GravityToggle from './GravityToggle';
import LanguageSwitcher from './i18n/LanguageSwitcher';
import { useI18n } from './i18n/useI18n';
import { useInstallPrompt } from './shared/useInstallPrompt';

type Props = {
  seed: string;
  gravityEnabled: boolean;
  onGravityChange: (enabled: boolean) => void;
  onStart: (gameId: string, seed: string) => void;
};

const Home = ({ seed, gravityEnabled, onGravityChange, onStart }: Props) => {
  const { t } = useI18n();
  const { canInstall, needsManualInstall, install } = useInstallPrompt();
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
        <GravityToggle enabled={gravityEnabled} onChange={onGravityChange} />
      </form>
      {canInstall && (
        <button type="button" className="button button--secondary" onClick={install}>
          {t('home.install')}
        </button>
      )}
      {needsManualInstall && <p className="menu__install-hint">{t('home.installIos')}</p>}
    </main>
  );
};

export default Home;
