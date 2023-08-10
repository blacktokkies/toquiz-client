import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserState {
  email: string;
  nickname: string;
  createdAt: string;
}

export interface UserActions {
  setUser: (newUser: UserState) => void;
  updateUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

export const initialUserState: UserState = {
  email: '',
  nickname: '',
  createdAt: '',
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
  const { email, nickname, createdAt } = state;
  return { email, nickname, createdAt };
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
