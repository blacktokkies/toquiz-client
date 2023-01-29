import { SuccessResponse } from '../response';
import { User } from './domain';

export type LogInResult = Pick<User, 'id' | 'nickname'>;

export type LogInResponse = SuccessResponse<LogInResult>;
