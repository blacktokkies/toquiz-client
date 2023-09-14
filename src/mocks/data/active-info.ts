import type { MyActiveInfo } from '@/lib/api/active-Info';

export let mockMyActiveInfo: MyActiveInfo = {
  createdIds: [],
  likedIds: [],
};
export const initMockMyActiveInfo = (): void => {
  mockMyActiveInfo = {
    createdIds: [],
    likedIds: [],
  };
};
