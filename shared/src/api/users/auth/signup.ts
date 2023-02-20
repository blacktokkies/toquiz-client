import type { SuccessResponse } from '../../response';
import type { User } from '../../../libs';

export interface SignUpBody {
  username: User['username'];
  password: User['password'];
  nickname: User['nickname'];
}

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;
