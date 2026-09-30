import type { ComponentType } from 'react';
import type { Effect, EffectOf } from '../../game/types';
import Beam from './Beam';
import Burst from './Burst';
import Lightning from './Lightning';
import Shatter from './Shatter';
import Shockwave from './Shockwave';
import Vortex from './Vortex';

type Props = { effects: Effect[]; rows: number; cols: number; flipped: boolean };

const mirrorEffect = (effect: Effect, rows: number): Effect => {
  const flip = (r: number) => rows - 1 - r;
  switch (effect.kind) {
    case 'vortex':
      return effect;
    case 'beam':
      return { ...effect, r: flip(effect.r), originR: flip(effect.originR) };
    case 'lightning':
      return { ...effect, r: flip(effect.r), targets: effect.targets.map((t) => ({ ...t, r: flip(t.r) })) };
    default:
      return { ...effect, r: flip(effect.r) };
  }
};

const COMPONENTS: { [K in Effect['kind']]: ComponentType<{ effect: EffectOf<K>; rows: number; cols: number }> } = {
  burst: Burst,
  shatter: Shatter,
  beam: Beam,
  shockwave: Shockwave,
  lightning: Lightning,
  vortex: Vortex,
};

const EffectsLayer = ({ effects, rows, cols, flipped }: Props) => (
  <div className="fx-layer">
    {effects.map((logicalEffect) => {
      const effect = flipped ? mirrorEffect(logicalEffect, rows) : logicalEffect;
      const Component = COMPONENTS[effect.kind] as ComponentType<{ effect: Effect; rows: number; cols: number }>;
      return <Component key={effect.id} effect={effect} rows={rows} cols={cols} />;
    })}
  </div>
);

export default EffectsLayer;
