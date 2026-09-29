const Shockwave = ({ effect }) => (
  <div className="fx fx-shock" style={{ '--r': effect.r, '--c': effect.c, '--radius': effect.radius }}>
    <span className="fx-shock__core" />
    <span className="fx-shock__wave" />
  </div>
);

export default Shockwave;
