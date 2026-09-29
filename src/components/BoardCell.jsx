const BoardCell = ({ row, col, ice, box }) => (
  <div className={`cell ${(row + col) % 2 ? 'cell--alt' : ''}`} style={{ '--r': row, '--c': col }}>
    {ice > 0 && <div className={`ice ice--${ice}`} />}
    {box > 0 && <div className={`box box--${box}`} />}
  </div>
);

export default BoardCell;
