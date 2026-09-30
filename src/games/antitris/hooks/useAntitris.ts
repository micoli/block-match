import { useCallback, useEffect, useReducer, useState } from 'react';
import { hashSeed } from '../../../shared/seed';
import { levelFor, tickInterval } from '../game/scoring';
import { createGame, reduce } from '../game/state';

export const FLIP_ANIMATION_MS = 700;

export const useAntitris = (seed: string) => {
  const [state, dispatch] = useReducer(reduce, undefined, () => createGame(hashSeed(seed)));
  const [flipping, setFlipping] = useState(false);
  const level = levelFor(state.lines);
  const active = state.status === 'playing' && !flipping;

  useEffect(() => {
    if (!state.flips) return undefined;
    setFlipping(true);
    const timer = setTimeout(() => setFlipping(false), FLIP_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [state.flips]);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => dispatch({ type: 'tick' }), tickInterval(level));
    return () => clearInterval(timer);
  }, [active, level]);

  const move = useCallback((dx: -1 | 1) => active && dispatch({ type: 'move', dx }), [active]);
  const rotate = useCallback(() => active && dispatch({ type: 'rotate' }), [active]);
  const hardDrop = useCallback(() => active && dispatch({ type: 'hardDrop' }), [active]);
  const restart = useCallback(() => dispatch({ type: 'restart', seed: hashSeed(seed) }), [seed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const handlers: Record<string, () => void> = {
        ArrowLeft: () => move(-1),
        ArrowRight: () => move(1),
        ArrowUp: rotate,
        ArrowDown: hardDrop,
        ' ': hardDrop,
      };
      const handler = handlers[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, rotate, hardDrop]);

  return { state, level, flipping, move, rotate, hardDrop, restart };
};
