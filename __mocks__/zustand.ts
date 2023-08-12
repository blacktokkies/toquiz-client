// https://docs.pmnd.rs/zustand/guides/testing#vitest
import type * as zustand from 'zustand';

import { act } from '@testing-library/react';

const {
  create: actualCreate,
  createStore: actualCreateStore,
  useStore: actualUseStore,
} = await vi.importActual<typeof zustand>('zustand');

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

// when creating a bound store, we get its initial state, create a reset function and add it in the set
export const create = (<T>() =>
  (stateCreator: zustand.StateCreator<T>) => {
    const store = actualCreate<T>(stateCreator);
    const initialState = store.getState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  }) as typeof zustand.create;

// when creating a vanilla store, we get its initial state, create a reset function and add it in the set
export const createStore = <T>(
  initializer: zustand.StateCreator<T>,
): zustand.StoreApi<T> => {
  const store = actualCreateStore(initializer);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

export const useStore = actualUseStore;

// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
