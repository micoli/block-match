import type { SolutionStep } from '../game/types';
import SolutionStepBoard from './SolutionStepBoard';
import { useI18n } from '../../../i18n/useI18n';

type Props = {
  steps: SolutionStep[] | null;
  onClose: () => void;
};

const SolutionModal = ({ steps, onClose }: Props) => {
  const { t } = useI18n();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(event) => event.stopPropagation()}>
        <h2>{t('blockMatch.solution.title')}</h2>
        {steps ? (
          <>
            <p>{t('blockMatch.solution.legend')}</p>
            <ol className="solution">
              {steps.map((step, index) => (
                <li key={index}>
                  <SolutionStepBoard board={step.board} move={step.move} />
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p>{t('blockMatch.solution.none')}</p>
        )}
        <button className="button" onClick={onClose}>
          {t('blockMatch.solution.close')}
        </button>
      </div>
    </div>
  );
};

export default SolutionModal;
