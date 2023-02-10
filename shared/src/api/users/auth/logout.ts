import { type SuccessResponse } from '@api/response';

export interface LogOutResult {
  message: string;
}

export type LogOutResponse = SuccessResponse<LogOutResult>;
