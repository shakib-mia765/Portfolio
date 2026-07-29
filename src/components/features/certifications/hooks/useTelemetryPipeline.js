import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_STATE = Object.freeze({
  error: null,
  pending: 0,
  status: "idle",
});
const useTelemetryPipeline = (processors = []) => {
  const mountedRef = useRef(true);
  const queueRef = useRef(Promise.resolve());
  const [state, setState] = useState(INITIAL_STATE);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  const track = useCallback(
    (event) => {
      const payload = Object.freeze({
        ...event,
        timestamp: event?.timestamp ?? Date.now(),
      });
      if (mountedRef.current) {
        setState((current) => ({
          ...current,
          pending: current.pending + 1,
          status: "processing",
        }));
      }

      queueRef.current = queueRef.current
        .then(() =>
          processors.reduce(
            (promise, processor) => promise.then(processor),
            Promise.resolve(payload)
          )
        )
        .then((result) => {
          if (mountedRef.current) setState({ error: null, pending: 0, status: "success" });
          return result;
        })
        .catch((error) => {
          const normalized = error instanceof Error ? error : new Error(String(error));
          if (mountedRef.current) setState({ error: normalized, pending: 0, status: "error" });
        });
      return queueRef.current;
    },
    [processors]
  );
  return { ...state, track };
};

export default useTelemetryPipeline;
