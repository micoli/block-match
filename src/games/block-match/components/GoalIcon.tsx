import type { Goal } from '../game/types';
import Gem from './Gem';

const GoalIcon = ({ goal }: { goal: Goal }) => {
  if (goal.type === 'color') return <Gem color={goal.color} />;
  return <span className={`goal-icon goal-icon--${goal.type}`} />;
};

export default GoalIcon;
