import type { EffectOf } from '../../game/types';

const Beam = ({ effect }: { effect: EffectOf<'beam'> }) => (
  <div
    className={`fx-beam fx-beam--${effect.dir}`}
    style={{ '--r': effect.r, '--c': effect.c, '--or': effect.originR, '--oc': effect.originC }}
  >
    <span className="fx-beam__ray" />
    <span className="fx-beam__rocket fx-beam__rocket--forward">🚀</span>
    <span className="fx-beam__rocket fx-beam__rocket--backward">🚀</span>
  </div>
);

export default Beam;
