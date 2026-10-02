import type { GoalProgress, Gravity } from '../game/types';
import GoalItem from './GoalItem';
import { useI18n } from '../../../i18n/useI18n';

type Props = {
  seed: string;
  levelNumber: number;
  movesLeft: number;
  goals: GoalProgress[];
  gravityEnabled: boolean;
  gravity: Gravity;
  movesToFlip: number | null;
  score: number;
  totalScore: number;
  onExit: () => void;
  onRestart: () => void;
  onMovesTap: () => void;
};

const Hud = ({
  seed,
  levelNumber,
  movesLeft,
  goals,
  gravityEnabled,
  gravity,
  movesToFlip,
  score,
  totalScore,
  onExit,
  onRestart,
  onMovesTap,
}: Props) => {
  const { t } = useI18n();
  return (
    <header className="hud">
      <div className="hud__top">
        <button className="icon-button" onClick={onExit} aria-label={t('blockMatch.hud.backToMap')}>
          ←
        </button>
        <div className="hud__title">
          <strong>{t('common.level', { level: levelNumber })}</strong>
          <small>{t('common.seed', { seed })}</small>
        </div>
        <button
          className="icon-button hud__restart"
          onClick={onRestart}
          aria-label={t('blockMatch.hud.restart')}
          title={t('blockMatch.hud.restart')}
        >
          ↺
        </button>
      </div>
      <div className="hud__score">
        <span>
          {t('common.score')} <strong>{score}</strong>
        </span>
        <span>
          {t('blockMatch.hud.total')} <strong>{totalScore}</strong>
        </span>
        {gravityEnabled && (
          <span className={`hud__gravity hud__gravity--${gravity}`} title={t('blockMatch.hud.gravity')}>
            {gravity === 'down' ? '⬇' : '⬆ +25%'}{' '}
            <small>{movesToFlip === null ? '' : t('blockMatch.hud.flipIn', { moves: movesToFlip })}</small>
          </span>
        )}
      </div>
      <div className="hud__panel">
        <div className="hud__moves" onClick={onMovesTap}>
          <span>{movesLeft}</span>
          <small>{t('blockMatch.hud.moves')}</small>
        </div>
        <ul className="hud__goals">
          {goals.map((goal, index) => (
            <GoalItem key={index} goal={goal} />
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Hud;
