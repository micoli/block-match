import type { GameProps } from '../../shared/types';
import GravityHeroGame from './GravityHeroGame';
import { SUPER_HERO } from './game/variants';

const GravitySuperHeroApp = (props: GameProps) => <GravityHeroGame {...props} variant={SUPER_HERO} />;

export default GravitySuperHeroApp;
