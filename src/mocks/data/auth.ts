import type { Member } from '@/lib/api/auth';

export const myAccount: Omit<Member, 'password'> = {
  id: -1,
  email: 'dev-email@toquiz.com',
  nickname: 'dev-nickname',
  provider: 'LOCAL',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};
