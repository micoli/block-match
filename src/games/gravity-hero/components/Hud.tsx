import { MAX_MISSES, multiplierFor } from '../game/engine';
import type { GameState } from '../game/types';
import { useI18n } from '../../../i18n/useI18n';

type Props = { state: GameState; best: number };

const Hud = ({ state, best }: Props) => {
  const { t, formatNumber } = useI18n();
  const { score, combo, misses, gravity, gravityEnabled, nextFlipAt, time, judgment } = state;
  return (
    <header className="gh-hud">
      <div className="gh-hud__stats">
        <span>
          {t('common.score')} <strong>{formatNumber(score)}</strong>
        </span>
        <span>
          {t('gravityHero.best')} <strong>{formatNumber(Math.max(best, score))}</strong>
        </span>
        <span>
          {t('gravityHero.combo')} <strong>{combo}</strong> · x{multiplierFor(combo)}
        </span>
      </div>
      <div className="gh-hud__stats gh-hud__stats--right">
        <span className={misses >= MAX_MISSES - 3 ? 'gh-hud__danger' : ''}>
          {t('gravityHero.misses')} <strong>{misses}</strong>/{MAX_MISSES}
        </span>
        {gravityEnabled && (
          <span className={`gh-hud__gravity gh-hud__gravity--${gravity}`}>
            {gravity === 'down' ? '⬇' : '⬆ +25%'}{' '}
            <small>{t('gravityHero.flipIn', { seconds: Math.max(0, Math.ceil(nextFlipAt - time)) })}</small>
          </span>
        )}
      </div>
      {judgment && (
        <p key={judgment.id} className={`gh-hud__judgment gh-hud__judgment--${judgment.type}`}>
          {t(`gravityHero.judgment.${judgment.type}`)}
        </p>
      )}
    </header>
  );
};

export default Hud;
