import Beam from './Beam.jsx';
import Burst from './Burst.jsx';
import Lightning from './Lightning.jsx';
import Shatter from './Shatter.jsx';
import Shockwave from './Shockwave.jsx';

const COMPONENTS = {
  burst: Burst,
  shatter: Shatter,
  beam: Beam,
  shockwave: Shockwave,
  lightning: Lightning,
};

const EffectsLayer = ({ effects, rows, cols }) => (
  <div className="fx-layer">
    {effects.map((effect) => {
      const Effect = COMPONENTS[effect.kind];
      return <Effect key={effect.id} effect={effect} rows={rows} cols={cols} />;
    })}
  </div>
);

export default EffectsLayer;
