import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_STATE = Object.freeze({
  data: null,
  error: null,
  status: "idle",
});

const useAsyncPipeline = (pipeline = []) => {
  const mountedRef = useRef(true);
  const [state, setState] = useState(INITIAL_STATE);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );
  const execute = useCallback(
    async (initialValue) => {
      setState({ data: null, error: null, status: "loading" });
      try {
        const result = await pipeline.reduce(
          (promise, step) => promise.then(step),
          Promise.resolve(initialValue)
        );
        if (mountedRef.current) {
          setState({ data: result, error: null, status: "success" });
        }

        return result;
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        if (mountedRef.current) {
          setState({ data: null, error: normalizedError, status: "error" });
        }
        throw normalizedError;
      }
    },
    [pipeline]
  );
  const reset = useCallback(() => setState(INITIAL_STATE), []);
  return { ...state, execute, reset };
};

export default useAsyncPipeline;
