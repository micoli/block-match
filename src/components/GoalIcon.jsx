import Gem from './Gem.jsx';

const GoalIcon = ({ goal }) => {
  if (goal.type === 'color') return <Gem color={goal.color} />;
  return <span className={`goal-icon goal-icon--${goal.type}`} />;
};

export default GoalIcon;
