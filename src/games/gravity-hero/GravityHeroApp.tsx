import { useEffect } from 'react';
import type { GameProps } from '../../shared/types';
import { buildGameUrl } from '../../shared/url';
import { useBestScore } from '../../shared/useBestScore';
import Board from './components/Board';
import GameOverModal from './components/GameOverModal';
import Hud from './components/Hud';
import { useGravityHero } from './hooks/useGravityHero';
import './styles.css';
import { useI18n } from '../../i18n/useI18n';

const GAME_ID = 'gravity-hero';

const GravityHeroApp = ({ seed, onHome }: GameProps) => {
  const { t } = useI18n();
  const { state, pressed, press, release, restart } = useGravityHero(seed);
  const over = state.status === 'over';
  const best = useBestScore(GAME_ID, seed, state.score, over);

  useEffect(() => {
    window.history.replaceState(null, '', buildGameUrl(GAME_ID, { seed }));
  }, [seed]);

  return (
    <main className="gh-game">
      <div className="gh-top">
        <button className="gh-back" onClick={onHome} aria-label={t('common.backHome')}>
          ←
        </button>
        <div className="gh-top__title">
          <h1>
            Gravity <span>Hero</span>
          </h1>
          <small>{t('common.seed', { seed })}</small>
        </div>
        <button className="gh-back" onClick={restart} aria-label={t('gravityHero.restart')} title={t('gravityHero.restart')}>
          ↺
        </button>
      </div>
      <Hud state={state} best={best} />
      <Board state={state} pressed={pressed} onPress={press} onRelease={release} />
      <p className="gh-help">{t('gravityHero.help')}</p>
      {over && <GameOverModal score={state.score} best={best} bestCombo={state.bestCombo} onRestart={restart} />}
    </main>
  );
};

export default GravityHeroApp;
