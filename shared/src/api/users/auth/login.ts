import { type SuccessResponse } from '@api/response';
import { type User } from '@api/users/domain';

export interface LogInBody {
  username: User['username'];
  nickname: User['nickname'];
}

export interface LogInResult {
  username: User['username'];
  nickname: User['nickname'];
}

export type LogInResponse = SuccessResponse<LogInResult>;
