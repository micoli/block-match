const RINGS = 4;

const Vortex = ({ effect }: { effect: { gravity: 'down' | 'up' } }) => (
  <div className={`fx-vortex fx-vortex--${effect.gravity}`}>
    {Array.from({ length: RINGS }, (_, i) => (
      <span key={i} className="fx-vortex__ring" style={{ '--i': i }} />
    ))}
    <span className="fx-vortex__core" />
  </div>
);

export default Vortex;
