import { type SuccessResponse } from '../response';

export interface LogOutResult {
  message: string;
}

export type LogOutResponse = SuccessResponse<LogOutResult>;
