import type { GameStatus } from '../game/types';
import Stars from './Stars';
import { useI18n } from '../../../i18n/useI18n';

type Props = {
  status: GameStatus;
  stars: number;
  score: number;
  bonus: number;
  tryHard: boolean;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
};

const EndModal = ({ status, stars, score, bonus, tryHard, onNext, onRetry, onExit }: Props) => {
  const { t, formatNumber } = useI18n();
  return (
    <div className="modal-backdrop">
      <div className="modal">
        {status === 'won' ? (
          <>
            <h2>{t('blockMatch.endModal.won')}</h2>
            <Stars count={stars} size="lg" />
            <p className="modal__score">
              <strong>{formatNumber(score)}</strong> {t('common.points')}
              {bonus > 0 && <small> {t('blockMatch.endModal.bonus', { bonus: formatNumber(bonus) })}</small>}
            </p>
            {tryHard && stars < 3 ? (
              <>
                <p>{t('blockMatch.endModal.tryHardLocked')}</p>
                <button className="button" onClick={onRetry}>
                  {t('blockMatch.endModal.retry')}
                </button>
              </>
            ) : (
              <button className="button" onClick={onNext}>
                {t('blockMatch.endModal.next')}
              </button>
            )}
          </>
        ) : (
          <>
            <h2>{t('blockMatch.endModal.lost')}</h2>
            <p>{t('blockMatch.endModal.goalsMissed')}</p>
            <button className="button" onClick={onRetry}>
              {t('blockMatch.endModal.retry')}
            </button>
          </>
        )}
        <button className="button button--secondary" onClick={onExit}>
          {t('blockMatch.endModal.map')}
        </button>
      </div>
    </div>
  );
};

export default EndModal;
