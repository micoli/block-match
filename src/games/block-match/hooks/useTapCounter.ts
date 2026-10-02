import { useRef } from 'react';

const TAP_WINDOW_MS = 1500;

export const useTapCounter = (target: number, onReached: () => void) => {
  const count = useRef(0);
  const lastTap = useRef(0);

  return () => {
    const now = performance.now();
    count.current = now - lastTap.current > TAP_WINDOW_MS ? 1 : count.current + 1;
    lastTap.current = now;
    if (count.current < target) return;
    count.current = 0;
    onReached();
  };
};
