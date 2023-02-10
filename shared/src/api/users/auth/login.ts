import { type SuccessResponse } from '@api/response';
import { type User } from '@api/users/domain';

export type LogInResult = Pick<User, 'username' | 'nickname'>;

export type LogInResponse = SuccessResponse<LogInResult>;
