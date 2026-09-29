import { useRef, useState } from 'react';
import BoardCell from './BoardCell.jsx';
import EffectsLayer from './effects/EffectsLayer.jsx';
import Tile from './Tile.jsx';

const DRAG_THRESHOLD = 0.35;

const isSameCell = (a, b) => a && b && a.r === b.r && a.c === b.c;
const isAdjacent = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;

const Board = ({ board, hint, effects, disabled, onSwap, onActivate }) => {
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const cellFromEvent = (event) => {
    const rect = containerRef.current.getBoundingClientRect();
    const size = rect.width / board.cols;
    return {
      r: Math.floor((event.clientY - rect.top) / size),
      c: Math.floor((event.clientX - rect.left) / size),
      size,
    };
  };

  const handleTap = (cell) => {
    const tile = board.tiles[cell.r]?.[cell.c];
    if (selected && isAdjacent(selected, cell)) {
      setSelected(null);
      onSwap(selected, cell);
      return;
    }
    if (tile?.special) {
      setSelected(null);
      onActivate(cell);
      return;
    }
    setSelected(isSameCell(selected, cell) || !tile ? null : cell);
  };

  const handlePointerDown = (event) => {
    if (disabled) return;
    const { r, c, size } = cellFromEvent(event);
    if (!board.tiles[r]?.[c]) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { cell: { r, c }, x: event.clientX, y: event.clientY, size, moved: false };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.moved) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < drag.size * DRAG_THRESHOLD) return;
    drag.moved = true;
    const target =
      Math.abs(dx) > Math.abs(dy)
        ? { r: drag.cell.r, c: drag.cell.c + Math.sign(dx) }
        : { r: drag.cell.r + Math.sign(dy), c: drag.cell.c };
    setSelected(null);
    onSwap(drag.cell, target);
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.moved) return;
    handleTap(drag.cell);
  };

  const cells = [];
  const tiles = [];
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.holes[r][c]) continue;
      cells.push(<BoardCell key={`${r}-${c}`} row={r} col={c} ice={board.ice[r][c]} box={board.boxes[r][c]} />);
      const tile = board.tiles[r][c];
      if (!tile) continue;
      const cell = { r, c };
      tiles.push(
        <Tile
          key={tile.id}
          tile={tile}
          row={r}
          col={c}
          selected={isSameCell(selected, cell)}
          hinted={isSameCell(hint?.from, cell) || isSameCell(hint?.to, cell)}
        />,
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`board ${effects.some((effect) => effect.kind === 'shockwave') ? 'board--shake' : ''}`}
      style={{ '--rows': board.rows, '--cols': board.cols }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (dragRef.current = null)}
    >
      {cells}
      {tiles}
      <EffectsLayer effects={effects} rows={board.rows} cols={board.cols} />
    </div>
  );
};

export default Board;
