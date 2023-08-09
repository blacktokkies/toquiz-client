// https://docs.pmnd.rs/zustand/guides/typescript#using-a-vanilla-store-as-a-bound-store

import type { UserState, UserActions } from '@/stores/user-store';

import { useStore } from 'zustand';

import { userStore } from '@/stores/user-store';

export const useUserStore = <T>(
  selector: (state: UserState & UserActions) => T,
): T => useStore(userStore, selector);
