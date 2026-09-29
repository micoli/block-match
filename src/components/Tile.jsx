import Gem from './Gem.jsx';
import SpecialIcon from './SpecialIcon.jsx';

const Tile = ({ tile, row, col, selected, hinted }) => {
  const classes = [
    'tile',
    tile.drop > 0 && 'tile--drop',
    tile.pop && 'tile--pop',
    selected && 'tile--selected',
    hinted && 'tile--hint',
    tile.clearing && 'tile--clearing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="tile-slot" style={{ '--r': row, '--c': col }}>
      <div className={classes} style={{ '--drop': tile.drop }}>
        {tile.special ? <SpecialIcon special={tile.special} /> : <Gem color={tile.color} />}
      </div>
    </div>
  );
};

export default Tile;
