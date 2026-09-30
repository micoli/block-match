import { useI18n } from './i18n/useI18n';

type Props = { enabled: boolean; onChange: (enabled: boolean) => void };

const GravityToggle = ({ enabled, onChange }: Props) => {
  const { t } = useI18n();
  return (
    <label className={`gravity-toggle ${enabled ? 'gravity-toggle--on' : ''}`}>
      <span className="gravity-toggle__icon" aria-hidden="true">
        🪐
      </span>
      <span className="gravity-toggle__text">
        <strong>{t('home.gravity')}</strong>
        <small>{t('home.gravityHint')}</small>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="gravity-toggle__input"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="gravity-toggle__switch" aria-hidden="true" />
    </label>
  );
};

export default GravityToggle;
