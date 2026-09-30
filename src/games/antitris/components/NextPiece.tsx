import { colorOf, shapeOf } from '../game/pieces';
import type { Kind } from '../game/types';
import { useI18n } from '../../../i18n/useI18n';

const NextPiece = ({ kind }: { kind: Kind }) => {
  const { t } = useI18n();
  const shape = shapeOf(kind);
  return (
    <div className="ft-next" style={{ '--size': shape.length }} aria-label={t('antitris.nextPiece', { kind })}>
      {shape.flatMap((row, r) =>
        row.map((filled, c) => (
          <span key={`${r}-${c}`} className={filled ? `ft-cell ft-cell--${colorOf(kind)}` : 'ft-next__empty'} />
        )),
      )}
    </div>
  );
};

export default NextPiece;
