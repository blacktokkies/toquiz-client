import type { Member } from '@/lib/api/auth';

import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserState {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
}

export interface UserActions {
  setUser: (newUser: UserState) => void;
  updateUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

export const initialUserState: UserState = {
  id: -1,
  email: '',
  nickname: '',
  provider: '',
  createdAt: '',
  updatedAt: '',
};

export const userStore = createStore(
  devtools<UserState & UserActions>((set) => ({
    ...initialUserState,
    setUser: (newUser) => {
      set(() => ({ ...newUser }));
    },
    updateUser: (user) => {
      set(() => ({ ...user }));
    },
    clearUser: () => {
      set(() => ({ ...initialUserState }));
    },
  })),
);

export const getUserState = (): UserState => {
  const state = userStore.getState();
  const { id, email, nickname, provider, createdAt, updatedAt } = state;
  return { id, email, nickname, provider, createdAt, updatedAt };
};

export const setUserState = (newUser: UserState): void => {
  const state = userStore.getState();
  state.setUser(newUser);
};

export const clearUserState = (): void => {
  const state = userStore.getState();
  state.clearUser();
};

export const updateUserState = (user: Partial<UserState>): void => {
  const state = userStore.getState();
  state.updateUser(user);
};
