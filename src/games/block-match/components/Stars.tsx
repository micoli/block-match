import { useI18n } from '../../../i18n/useI18n';

const MAX_STARS = 3;

type Props = { count: number; size?: 'sm' | 'md' | 'lg' };

const Stars = ({ count, size = 'md' }: Props) => {
  const { t } = useI18n();
  return (
    <span className={`stars stars--${size}`} aria-label={t('blockMatch.stars.label', { count, max: MAX_STARS })}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span key={i} className={i < count ? 'star star--on' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
};

export default Stars;
