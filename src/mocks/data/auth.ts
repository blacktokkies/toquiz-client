import type { Member } from '@/lib/api/auth';

export const myAccount: Pick<Member, 'email' | 'nickname' | 'createdAt'> = {
  email: 'dev-email@toquiz.com',
  nickname: 'dev-nickname',
  createdAt: new Date().toString(),
};
