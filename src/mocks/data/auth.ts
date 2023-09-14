import type { Member } from '@/lib/api/auth';

export const createMockUserId = (() => {
  let id = 0;
  return () => id++;
})();
export const createMockUser = (): Omit<Member, 'password'> => ({
  id: createMockUserId(),
  email: 'test@email.com',
  nickname: '테스트 닉네임',
  provider: 'LOCAL',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});

export let mockUser: Omit<Member, 'password'> = createMockUser();
export const initMockUser = (): void => {
  mockUser = createMockUser();
};
