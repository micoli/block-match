import { useStoredFlag } from './useStoredFlag';

export const useGravitySetting = () => useStoredFlag('games:gravity-enabled', true);
