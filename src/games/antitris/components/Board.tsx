import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { COLS, ROWS } from '../game/engine';
import type { Board as BoardData, Gravity, Piece } from '../game/types';
import { viewCells } from '../game/view';

const TAP_TOLERANCE = 0.5;
const DROP_DISTANCE = 1.5;

type Drag = { startX: number; startY: number; anchorX: number; size: number; moved: boolean; dropped: boolean };

type Props = {
  board: BoardData;
  piece: Piece;
  gravity: Gravity;
  flips: number;
  onMove: (dx: -1 | 1) => void;
  onRotate: () => void;
  onHardDrop: () => void;
};

const Board = ({ board, piece, gravity, flips, onMove, onRotate, onHardDrop }: Props) => {
  const dragRef = useRef<Drag | null>(null);
  const flipped = gravity === 'up';
  const fallSign = flipped ? -1 : 1;
  const cells = viewCells(board, piece);
  const rows = flipped ? [...cells].reverse() : cells;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const size = event.currentTarget.getBoundingClientRect().width / COLS;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      anchorX: event.clientX,
      size,
      moved: false,
      dropped: false,
    };
  };

  const handlePointerMove = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.dropped) return;
    while (Math.abs(event.clientX - drag.anchorX) >= drag.size) {
      const direction = event.clientX > drag.anchorX ? 1 : -1;
      drag.anchorX += direction * drag.size;
      drag.moved = true;
      onMove(direction);
    }
    const dx = event.clientX - drag.startX;
    const dy = (event.clientY - drag.startY) * fallSign;
    if (drag.moved || dy < drag.size * DROP_DISTANCE || dy < Math.abs(dx)) return;
    drag.dropped = true;
    onHardDrop();
  };

  const handlePointerUp = (event: PointerEvent) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.moved || drag.dropped) return;
    const travel = Math.max(Math.abs(event.clientX - drag.startX), Math.abs(event.clientY - drag.startY));
    if (travel < drag.size * TAP_TOLERANCE) onRotate();
  };

  return (
    <div
      className="ft-board"
      style={{ '--cols': COLS, '--rows': ROWS }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (dragRef.current = null)}
    >
      <div key={flips} className={`ft-grid ${flips ? 'ft-grid--flip' : ''}`}>
        {rows.map((row, r) =>
          row.map(({ color, ghost }, c) => (
            <div
              key={`${r}-${c}`}
              className={`ft-cell ${color ? `ft-cell--${color}` : ''} ${ghost ? 'ft-cell--ghost' : ''}`}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Board;
