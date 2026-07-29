import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DELAY = 300;
const useQuantumDebounce = (value, delay = DEFAULT_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const latestValueRef = useRef(value);
  const timerRef = useRef(null);
  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const flush = useCallback(() => {
    clearTimer();
    setDebouncedValue(latestValueRef.current);
  }, [clearTimer]);
  const cancel = useCallback(() => {
    clearTimer();
    latestValueRef.current = debouncedValue;
  }, [clearTimer, debouncedValue]);
  useEffect(() => {
    latestValueRef.current = value;
    clearTimer();
    timerRef.current = setTimeout(() => {
      setDebouncedValue(latestValueRef.current);
      timerRef.current = null;
    }, Math.max(0, Number(delay) || 0));
    return clearTimer;
  }, [value, delay, clearTimer]);
  return { value: debouncedValue, cancel, flush };
};

export default useQuantumDebounce;
