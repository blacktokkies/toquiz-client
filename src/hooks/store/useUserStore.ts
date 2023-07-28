// https://docs.pmnd.rs/zustand/guides/typescript#using-a-vanilla-store-as-a-bound-store

import type { UserState } from '@/store/userStore';

import { useStore } from 'zustand';

import { userStore } from '@/store/userStore';

export const useUserStore = <T>(selector: (state: UserState) => T): T =>
  useStore(userStore, selector);
