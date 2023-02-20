import type { SuccessResponse } from '../../response';
import type { User } from '../../../libs';

export interface LogInBody {
  username: User['username'];
  password: User['password'];
}

export interface LogInResult {
  username: User['username'];
  nickname: User['nickname'];
}

export type LogInResponse = SuccessResponse<LogInResult>;
