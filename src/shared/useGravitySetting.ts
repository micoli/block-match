import { useCallback, useState } from 'react';

const STORAGE_KEY = 'games:gravity-enabled';

const readSetting = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const useGravitySetting = () => {
  const [enabled, setEnabledState] = useState(readSetting);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // storage unavailable: the setting is simply not remembered
    }
  }, []);

  return [enabled, setEnabled] as const;
};
