import type { Member } from '@/lib/api/auth';

export const myAccount: Omit<Member, 'password'> = {
  id: -1,
  email: 'dev-email@toquiz.com',
  nickname: 'dev-nickname',
  provider: 'LOCAL',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};

let id = 0;
export const createMockUser = (): Omit<Member, 'password'> => ({
  id: id++,
  email: '테스트 이메일',
  nickname: '테스트 닉네임',
  provider: 'TEST',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
});
