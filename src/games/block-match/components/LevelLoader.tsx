import { useI18n } from '../../../i18n/useI18n';

const CELLS = 9;

type Props = { levelNumber: number; onExit: () => void };

const LevelLoader = ({ levelNumber, onExit }: Props) => {
  const { t } = useI18n();
  return (
    <main className="loader" role="status" aria-live="polite">
      <button className="icon-button loader__exit" onClick={onExit} aria-label={t('blockMatch.hud.backToMap')}>
        ←
      </button>
      <div className="loader__grid" aria-hidden="true">
        {Array.from({ length: CELLS }, (_, i) => (
          <span key={i} className="loader__cell" style={{ '--i': i }} />
        ))}
      </div>
      <strong>{t('common.level', { level: levelNumber })}</strong>
      <small>{t('blockMatch.loader.preparing')}</small>
    </main>
  );
};

export default LevelLoader;
