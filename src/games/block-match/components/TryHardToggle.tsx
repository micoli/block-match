import { useI18n } from '../../../i18n/useI18n';

type Props = { enabled: boolean; onChange: (enabled: boolean) => void };

const TryHardToggle = ({ enabled, onChange }: Props) => {
  const { t } = useI18n();
  return (
    <label className={`try-hard-toggle ${enabled ? 'try-hard-toggle--on' : ''}`}>
      <span>🔥 {t('blockMatch.map.tryHard')}</span>
      <input
        type="checkbox"
        role="switch"
        className="try-hard-toggle__input"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="try-hard-toggle__switch" aria-hidden="true" />
    </label>
  );
};

export default TryHardToggle;
