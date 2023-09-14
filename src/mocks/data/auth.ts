import type { Member } from '@/lib/api/auth';

export const createMockUserId = (() => {
  let id = 0;
  return () => id++;
})();
export const createMockUser = (): Omit<Member, 'password'> => ({
  id: createMockUserId(),
  email: 'test@email.com',
  nickname: '테스트 닉네임',
  provider: 'TEST',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});

export const mockUser: Omit<Member, 'password'> = {
  id: createMockUserId(),
  email: 'dev-email@toquiz.com',
  nickname: 'dev-nickname',
  provider: 'LOCAL',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};
