const MAX_STARS = 3;

const Stars = ({ count, size = 'md' }) => (
  <span className={`stars stars--${size}`} aria-label={`${count} étoiles sur ${MAX_STARS}`}>
    {Array.from({ length: MAX_STARS }, (_, i) => (
      <span key={i} className={i < count ? 'star star--on' : 'star'}>
        ★
      </span>
    ))}
  </span>
);

export default Stars;
