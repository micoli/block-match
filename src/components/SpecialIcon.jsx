const ICONS = {
  rocketH: '🚀',
  rocketV: '🚀',
  bomb: '🧨',
  lightball: '🔮',
};

const SpecialIcon = ({ special }) => <span className={`special special--${special}`}>{ICONS[special]}</span>;

export default SpecialIcon;
