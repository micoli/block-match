import type { GoalProgress } from '../game/types';
import GoalIcon from './GoalIcon';

const GoalItem = ({ goal }: { goal: GoalProgress }) => (
  <li className={`goal ${goal.remaining === 0 ? 'goal--done' : ''}`}>
    <span className="goal__icon">
      <GoalIcon goal={goal} />
    </span>
    <span className="goal__count">{goal.remaining === 0 ? '✓' : goal.remaining}</span>
  </li>
);

export default GoalItem;
