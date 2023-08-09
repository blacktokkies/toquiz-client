import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

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

const initialUserState: UserState = {
  email: '',
  nickname: '',
  createdAt: '',
};

export const userStore = createStore<UserState & UserActions>()(
  devtools((set) => ({
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
