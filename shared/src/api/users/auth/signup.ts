import { type SuccessResponse } from '@api/response';
import { type User } from '@api/users/domain';

export interface SignUpBody {
  username: User['username'];
  password: User['password'];
  nickname: User['nickname'];
}

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;
