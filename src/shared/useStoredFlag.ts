import { useCallback, useState } from 'react';

const readFlag = (key: string, fallback: boolean) => {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : stored === 'true';
  } catch {
    return fallback;
  }
};

export const useStoredFlag = (key: string, fallback: boolean) => {
  const [value, setValueState] = useState(() => readFlag(key, fallback));

  const setValue = useCallback(
    (next: boolean) => {
      setValueState(next);
      try {
        localStorage.setItem(key, String(next));
      } catch {
        // storage unavailable: the setting is simply not remembered
      }
    },
    [key],
  );

  return [value, setValue] as const;
};
