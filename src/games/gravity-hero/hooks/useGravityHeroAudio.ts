import { useCallback, useEffect, useRef } from 'react';
import { FIRST_BEAT, afterBeat, backingFor, laneFrequency } from '../audio/music';
import { createSynth } from '../audio/synth';
import type { Synth } from '../audio/synth';
import type { GameState } from '../game/types';

export const useGravityHeroAudio = (state: GameState, muted: boolean) => {
  const synthRef = useRef<Synth | null>(null);
  const mutedRef = useRef(muted);
  const beatRef = useRef(FIRST_BEAT);
  const lastTimeRef = useRef(0);
  const { time, judgment, gravity, flips, status } = state;

  const play = useCallback((sound: (synth: Synth) => void) => {
    const synth = synthRef.current;
    if (synth && !mutedRef.current) sound(synth);
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    try {
      synthRef.current = createSynth();
    } catch {
      // audio unavailable: the game is simply silent
    }
    const resume = () => synthRef.current?.resume();
    window.addEventListener('keydown', resume);
    window.addEventListener('pointerdown', resume);
    return () => {
      window.removeEventListener('keydown', resume);
      window.removeEventListener('pointerdown', resume);
      synthRef.current?.close();
      synthRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (time < lastTimeRef.current) beatRef.current = FIRST_BEAT;
    lastTimeRef.current = time;
    while (beatRef.current.time <= time) {
      const { kick, snare, hat, bass } = backingFor(beatRef.current.index);
      play((synth) => {
        if (kick) synth.kick();
        if (snare) synth.snare();
        if (hat) synth.hat();
        if (bass) synth.bass(bass);
      });
      beatRef.current = afterBeat(beatRef.current);
    }
  }, [time, play]);

  useEffect(() => {
    if (!judgment) return;
    play((synth) => {
      if (judgment.type === 'miss') synth.miss();
      else synth.note(laneFrequency(judgment.lane, gravity), judgment.kind === 'half');
    });
  }, [judgment, play]);

  useEffect(() => {
    if (flips) play((synth) => synth.flip());
  }, [flips, play]);

  useEffect(() => {
    if (status === 'over') play((synth) => synth.gameOver());
  }, [status, play]);
};
