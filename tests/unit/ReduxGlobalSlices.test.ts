import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import { rootReducer } from '../../src/store';

type RootState = ReturnType<typeof rootReducer>;
type StateKey = keyof RootState;
const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: true,
      }),
  });

const initialize = (): RootState =>
  rootReducer(undefined, { type: '@@redux/INIT' });
describe('Redux global slices', () => {
  it('initializes every registered slice', () => {
    const state = initialize();
    expect(state).toBeTypeOf('object');
    expect(state).not.toBeNull();
    expect(Object.keys(state).length).toBeGreaterThan(0);
    expect(Object.values(state).every((slice) => slice !== undefined)).toBe(true);
  });
  it('keeps state unchanged for unknown actions', () => {
    const state = initialize();
    const next = rootReducer(state, { type: 'test/unknown' });
    expect(next).toBe(state);
  });

  it('creates isolated store instances', () => {
    const first = createStore();
    const second = createStore();
    expect(first).not.toBe(second);
    expect(first.getState()).toEqual(second.getState());
    first.dispatch({ type: 'test/unknown' });
    expect(second.getState()).toEqual(initialize());
  });
  it('hydrates valid preloaded state', () => {
    const initial = initialize();
    const key = Object.keys(initial)[0] as StateKey;
    const preloaded = { [key]: initial[key] } as Partial<RootState>;
    const store = createStore(preloaded);
    expect(store.getState()[key]).toEqual(initial[key]);
  });
  it('does not mutate previous state', () => {
    const store = createStore();
    const before = store.getState();
    store.dispatch({ type: 'test/unknown' });
    expect(store.getState()).toBe(before);
    expect(store.getState()).toEqual(before);
  });

  it('supports repeated deterministic initialization', () => {
    expect(initialize()).toEqual(initialize());
  });
  it('rejects undefined slice reducers', () => {
    const state = initialize();
    for (const [key, value] of Object.entries(state)) {
      expect(value, `${key} returned undefined`).not.toBeUndefined();
    }
  });
  it('keeps the state serializable', () => {
    const state = createStore().getState();
    expect(() => JSON.stringify(state)).not.toThrow();
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });

  it('notifies subscribers once per dispatch', () => {
    const store = createStore();
    let calls = 0;
    const unsubscribe = store.subscribe(() => {
      calls += 1;
    });
    store.dispatch({ type: 'test/unknown' });
    unsubscribe();
    store.dispatch({ type: 'test/unknown' });
    expect(calls).toBe(1);
  });

  it('preserves reducer keys across dispatches', () => {
    const store = createStore();
    const before = Object.keys(store.getState()).sort();
    store.dispatch({ type: 'test/unknown' });
    expect(Object.keys(store.getState()).sort()).toEqual(before);
  });
});
