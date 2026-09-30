import { useStoredFlag } from './useStoredFlag';

export const useSoundMuted = () => useStoredFlag('games:sound-muted', false);
