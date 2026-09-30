import { useCallback, useEffect, useReducer, useState } from 'react';
import { hashSeed } from '../../../shared/seed';
import { createGame, reduce } from '../game/engine';
import { LANES } from '../game/types';

export const FLIP_ANIMATION_MS = 700;
export const LANE_KEYS = ['c', 'v', 'b', 'n'];

const MAX_FRAME_SECONDS = 0.1;

export const useGravityHero = (seed: string, gravityEnabled: boolean) => {
  const [state, dispatch] = useReducer(reduce, undefined, () => createGame(hashSeed(seed), gravityEnabled));
  const [flipping, setFlipping] = useState(false);
  const [pressed, setPressed] = useState<boolean[]>(() => Array(LANES).fill(false));
  const playing = state.status === 'playing';
  const active = playing && !flipping;

  useEffect(() => {
    if (!state.flips) return undefined;
    setFlipping(true);
    const timer = setTimeout(() => setFlipping(false), FLIP_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [state.flips]);

  useEffect(() => {
    if (!active) return undefined;
    let last = performance.now();
    let frame = requestAnimationFrame(function loop(now) {
      dispatch({ type: 'tick', dt: Math.min((now - last) / 1000, MAX_FRAME_SECONDS) });
      last = now;
      frame = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const setLanePressed = useCallback((lane: number, value: boolean) => {
    setPressed((current) => current.map((isPressed, index) => (index === lane ? value : isPressed)));
  }, []);

  const press = useCallback(
    (lane: number) => {
      setLanePressed(lane, true);
      if (active) dispatch({ type: 'press', lane });
    },
    [active, setLanePressed],
  );

  const release = useCallback(
    (lane: number) => {
      setLanePressed(lane, false);
      dispatch({ type: 'release', lane });
    },
    [setLanePressed],
  );

  const restart = useCallback(() => dispatch({ type: 'restart', seed: hashSeed(seed) }), [seed]);

  useEffect(() => {
    const laneOf = (event: KeyboardEvent) => LANE_KEYS.indexOf(event.key.toLowerCase());
    const onKeyDown = (event: KeyboardEvent) => {
      const lane = laneOf(event);
      if (lane < 0 || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      if (!event.repeat) press(lane);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const lane = laneOf(event);
      if (lane >= 0) release(lane);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [press, release]);

  return { state, pressed, press, release, restart };
};
