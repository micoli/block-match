import { useI18n } from '../../../i18n/useI18n';

type Props = { score: number; best: number; onRestart: () => void };

const GameOverModal = ({ score, best, onRestart }: Props) => {
  const { t, formatNumber } = useI18n();
  return (
    <div className="ft-modal-backdrop">
      <div className="ft-modal">
        <h2>{t('antitris.gameOver')}</h2>
        <p>
          <strong>{formatNumber(score)}</strong> {t('common.points')}
        </p>
        {score >= best && score > 0 && <p>{t('antitris.newBest')}</p>}
        <button className="ft-button" onClick={onRestart}>
          {t('antitris.replay')}
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
