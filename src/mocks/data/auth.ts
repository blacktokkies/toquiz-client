import type { Member } from '@/lib/api/auth';

export const me: Pick<Member, 'email' | 'nickname' | 'createdAt'> = {
  email: 'devemail@toquiz.com',
  nickname: 'devnickname',
  createdAt: new Date().toString(),
};
