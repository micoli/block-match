import { LANE_KEYS } from '../hooks/useGravityHero';
import { activeLanes } from '../game/variants';
import { TRAVEL_SECONDS } from '../game/engine';
import type { GameState } from '../game/types';
import Lane from './Lane';

type Props = {
  state: GameState;
  pressed: boolean[];
  onPress: (lane: number) => void;
  onRelease: (lane: number) => void;
};

const Board = ({ state, pressed, onPress, onRelease }: Props) => {
  const { notes, gravity, flips, time, judgment, variant } = state;
  const enabled = activeLanes(variant, time + TRAVEL_SECONDS);
  return (
    <div className="gh-board">
      <div key={flips} className={`gh-lanes ${flips ? 'gh-lanes--flip' : ''}`}>
        {LANE_KEYS.slice(0, variant.laneCount).map((keyLabel, index) => (
          <Lane
            key={keyLabel}
            index={index}
            keyLabel={keyLabel.toUpperCase()}
            notes={notes.filter((note) => note.lane === index)}
            gravity={gravity}
            now={time}
            active={enabled.includes(index)}
            pressed={pressed[index]}
            judgment={judgment?.lane === index ? judgment : null}
            onPress={onPress}
            onRelease={onRelease}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
