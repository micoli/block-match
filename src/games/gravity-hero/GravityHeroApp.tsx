import type { GameProps } from '../../shared/types';
import GravityHeroGame from './GravityHeroGame';
import { HERO } from './game/variants';

const GravityHeroApp = (props: GameProps) => <GravityHeroGame {...props} variant={HERO} />;

export default GravityHeroApp;
