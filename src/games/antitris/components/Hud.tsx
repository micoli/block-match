import type { GameState } from '../game/types';
import NextPiece from './NextPiece';
import { useI18n } from '../../../i18n/useI18n';

type Props = { state: GameState; level: number; best: number };

const Hud = ({ state, level, best }: Props) => {
  const { t, formatNumber } = useI18n();
  const { score, lines, next, gravity, gravityEnabled, flipAt, placed, lastClear } = state;
  return (
    <header className="ft-hud">
      <div className="ft-hud__stats">
        <span>
          {t('common.score')} <strong>{formatNumber(score)}</strong>
        </span>
        <span>
          {t('antitris.best')} <strong>{formatNumber(Math.max(best, score))}</strong>
        </span>
        <span>
          {t('common.level', { level })} · {t('antitris.lines')} <strong>{lines}</strong>
        </span>
        {gravityEnabled && (
          <span className={`ft-hud__gravity ft-hud__gravity--${gravity}`}>
            {gravity === 'down' ? '⬇' : '⬆ +25%'} <small>{t('antitris.flipIn', { pieces: flipAt - placed })}</small>
          </span>
        )}
      </div>
      <div className="ft-hud__next">
        <small>{t('antitris.next')}</small>
        <NextPiece kind={next} />
      </div>
      {lastClear && (
        <p key={lastClear.id} className="ft-hud__clear">
          {t(`antitris.lineClear.${lastClear.lines}`)} +{lastClear.points}
        </p>
      )}
    </header>
  );
};

export default Hud;
