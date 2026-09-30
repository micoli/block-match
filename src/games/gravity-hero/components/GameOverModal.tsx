import { useI18n } from '../../../i18n/useI18n';

type Props = { score: number; best: number; bestCombo: number; onRestart: () => void };

const GameOverModal = ({ score, best, bestCombo, onRestart }: Props) => {
  const { t, formatNumber } = useI18n();
  return (
    <div className="gh-modal-backdrop">
      <div className="gh-modal">
        <h2>{t('gravityHero.gameOver')}</h2>
        <p>
          <strong>{formatNumber(score)}</strong> {t('common.points')}
        </p>
        <p>{t('gravityHero.bestCombo', { combo: bestCombo })}</p>
        {score >= best && score > 0 && <p>{t('gravityHero.newBest')}</p>}
        <button className="gh-button" onClick={onRestart}>
          {t('gravityHero.replay')}
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
