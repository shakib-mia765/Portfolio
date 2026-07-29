import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DELAY = 300;
const useDebounceState = (initialValue, delay = DEFAULT_DELAY) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef(null);
  const clearPendingUpdate = useCallback(() => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  const updateValue = useCallback((nextValue) => {
    setValue((currentValue) =>
      typeof nextValue === "function"
        ? nextValue(currentValue)
        : nextValue
    );
  }, []);

  const flush = useCallback(() => {
    clearPendingUpdate();
    setDebouncedValue(value);
  }, [clearPendingUpdate, value]);
  const reset = useCallback(() => {
    clearPendingUpdate();
    setValue(initialValue);
    setDebouncedValue(initialValue);
  }, [clearPendingUpdate, initialValue]);

  useEffect(() => {
    clearPendingUpdate();
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
    }, Math.max(0, delay));
    return clearPendingUpdate;
  }, [value, delay, clearPendingUpdate]);
  return { value, debouncedValue, setValue: updateValue, flush, reset };
};

export default useDebounceState;
