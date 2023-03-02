import { devtools, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export interface User {
  id: string;
  username: string;
  nickname: string;
  createdAt: Date;
}

export interface UserState {
  user: User | null;
  setUser: (newUser: User | null) => void;
}

// https://docs.pmnd.rs/zustand/integrations/immer-middleware
// https://github.com/pmndrs/zustand/blob/6be46fd900ef2c05c9db5939af0dc8c6c93a37ed/tests/middlewareTypes.test.tsx#L408-L424
export const userStore = createStore<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        setUser: (newUser) => {
          set((state) => ({ user: newUser }));
        },
      }),
      { name: 'LOGIN_USER' },
    ),
  ),
);

export const getUser = (): UserState['user'] => userStore.getState().user;
export const setUser = (newUser: User | null): void => {
  userStore.getState().setUser(newUser);
};
