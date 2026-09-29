const SHARDS = 8;

const Burst = ({ effect }) => (
  <div className={`fx fx-burst fx--color-${effect.color}`} style={{ '--r': effect.r, '--c': effect.c }}>
    <span className="fx-burst__flash" />
    <span className="fx-burst__ring" />
    {Array.from({ length: SHARDS }, (_, i) => (
      <span
        key={i}
        className="fx-burst__shard"
        style={{
          '--a': `${(360 / SHARDS) * i + ((effect.id * 37) % 45)}deg`,
          '--d': 0.55 + ((i * 7 + effect.id) % 5) * 0.12,
        }}
      />
    ))}
  </div>
);

export default Burst;
