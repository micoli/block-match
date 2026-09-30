import { useEffect } from 'react';
import type { GameProps } from '../../shared/types';
import type { Variant } from './game/variants';
import { buildGameUrl } from '../../shared/url';
import { useBestScore } from '../../shared/useBestScore';
import Board from './components/Board';
import GameOverModal from './components/GameOverModal';
import Hud from './components/Hud';
import { LANE_KEYS, useGravityHero } from './hooks/useGravityHero';
import './styles.css';
import { useI18n } from '../../i18n/useI18n';

type Props = GameProps & { variant: Variant };

const GravityHeroGame = ({ seed, gravityEnabled, variant, onHome }: Props) => {
  const { t } = useI18n();
  const { state, pressed, press, release, restart } = useGravityHero(seed, gravityEnabled, variant);
  const over = state.status === 'over';
  const best = useBestScore(variant.id, seed, state.score, over);

  useEffect(() => {
    window.history.replaceState(null, '', buildGameUrl(variant.id, { seed }));
  }, [variant.id, seed]);

  return (
    <main className="gh-game" style={{ '--gh-lanes': variant.laneCount }}>
      <div className="gh-top">
        <button className="gh-back" onClick={onHome} aria-label={t('common.backHome')}>
          ←
        </button>
        <div className="gh-top__title">
          <h1>
            Gravity <span>{variant.name}</span>
          </h1>
          <small>{t('common.seed', { seed })}</small>
        </div>
        <button className="gh-back" onClick={restart} aria-label={t('gravityHero.restart')} title={t('gravityHero.restart')}>
          ↺
        </button>
      </div>
      <Hud state={state} best={best} />
      <Board state={state} pressed={pressed} onPress={press} onRelease={release} />
      <p className="gh-help">{t('gravityHero.help', { keys: LANE_KEYS.slice(0, variant.laneCount).join(' ').toUpperCase() })}</p>
      {over && <GameOverModal score={state.score} best={best} bestCombo={state.bestCombo} onRestart={restart} />}
    </main>
  );
};

export default GravityHeroGame;
