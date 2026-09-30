import { colorOf, shapeOf } from '../game/pieces';
import type { Kind } from '../game/types';

const NextPiece = ({ kind }: { kind: Kind }) => {
  const shape = shapeOf(kind);
  return (
    <div className="ft-next" style={{ '--size': shape.length }} aria-label={`Prochaine pièce : ${kind}`}>
      {shape.flatMap((row, r) =>
        row.map((filled, c) => (
          <span key={`${r}-${c}`} className={filled ? `ft-cell ft-cell--${colorOf(kind)}` : 'ft-next__empty'} />
        )),
      )}
    </div>
  );
};

export default NextPiece;
