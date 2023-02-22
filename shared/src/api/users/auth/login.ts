import type { SuccessResponse } from '../../response';
import type { User } from '../../../libs';

export interface LogInBody {
  username: User['username'];
  password: User['password'];
}

export interface LogInResult {
  user: {
    id: User['id'];
    username: User['username'];
    nickname: User['nickname'];
    createdAt: User['createdAt'];
  };
  accessToken: string;
}

export type LogInResponse = SuccessResponse<LogInResult>;
