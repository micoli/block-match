import type { Special } from '../game/types';

const ICONS: Record<Special, string> = {
  rocketH: '🚀',
  rocketV: '🚀',
  bomb: '🧨',
  lightball: '🔮',
};

const SpecialIcon = ({ special }: { special: Special }) => <span className={`special special--${special}`}>{ICONS[special]}</span>;

export default SpecialIcon;
