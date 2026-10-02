import type { Board, Move } from '../game/types';
import BoardCell from './BoardCell';
import Tile from './Tile';

type Props = { board: Board; move: Move };

const center = (value: number) => value + 0.5;

const SolutionStepBoard = ({ board, move }: Props) => {
  const cells = [];
  const tiles = [];
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (board.holes[r][c]) continue;
      cells.push(<BoardCell key={`${r}-${c}`} row={r} col={c} ice={board.ice[r][c]} box={board.boxes[r][c]} />);
      const tile = board.tiles[r][c];
      if (!tile) continue;
      const isMoveCell = (move.from.r === r && move.from.c === c) || (move.to?.r === r && move.to.c === c);
      tiles.push(
        <Tile key={tile.id} tile={{ ...tile, drop: 0, pop: false, clearing: false }} row={r} col={c} selected={false} hinted={isMoveCell} />,
      );
    }
  }

  return (
    <div className="board board--mini" style={{ '--rows': board.rows, '--cols': board.cols, '--speed': 1 }}>
      {cells}
      {tiles}
      {move.to && (
        <svg className="solution__arrow" viewBox={`0 0 ${board.cols} ${board.rows}`}>
          <defs>
            <marker id="solution-arrowhead" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4 Z" fill="#fde047" />
            </marker>
          </defs>
          <line
            x1={center(move.from.c)}
            y1={center(move.from.r)}
            x2={center(move.to.c)}
            y2={center(move.to.r)}
            stroke="#fde047"
            strokeWidth="0.22"
            strokeLinecap="round"
            markerEnd="url(#solution-arrowhead)"
          />
        </svg>
      )}
    </div>
  );
};

export default SolutionStepBoard;
