import { useEffect } from 'react';
import type { GameProps } from '../../shared/types';
import { useBestScore } from '../../shared/useBestScore';
import { buildGameUrl } from '../../shared/url';
import Board from './components/Board';
import GameOverModal from './components/GameOverModal';
import Hud from './components/Hud';
import { useAntitris } from './hooks/useAntitris';
import './styles.css';
import { useI18n } from '../../i18n/useI18n';

const GAME_ID = 'antitris';

const AntitrisApp = ({ seed, gravityEnabled, onHome }: GameProps) => {
  const { t } = useI18n();
  const { state, level, move, rotate, hardDrop, restart } = useAntitris(seed, gravityEnabled);
  const over = state.status === 'over';
  const best = useBestScore(GAME_ID, seed, state.score, over);

  useEffect(() => {
    window.history.replaceState(null, '', buildGameUrl(GAME_ID, { seed }));
  }, [seed]);

  return (
    <main className="ft-game">
      <div className="ft-top">
        <button className="ft-back" onClick={onHome} aria-label={t('common.backHome')}>
          ←
        </button>
        <div className="ft-top__title">
          <h1>
            Anti<span>tris</span>
          </h1>
          <small>{t('common.seed', { seed })}</small>
        </div>
        <button className="ft-back" onClick={restart} aria-label={t('antitris.restart')} title={t('antitris.restart')}>
          ↺
        </button>
      </div>
      <Hud state={state} level={level} best={best} />
      <Board
        board={state.board}
        piece={state.piece}
        gravity={state.gravity}
        flips={state.flips}
        onMove={move}
        onRotate={rotate}
        onHardDrop={hardDrop}
      />
      <p className="ft-help">{t('antitris.help')}</p>
      {over && <GameOverModal score={state.score} best={best} onRestart={restart} />}
    </main>
  );
};

export default AntitrisApp;
