import { type SuccessResponse } from '../response';
import { type User } from './domain';

export type LogInResult = Pick<User, 'id' | 'nickname'>;

export type LogInResponse = SuccessResponse<LogInResult>;
