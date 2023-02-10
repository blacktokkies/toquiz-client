import { type SuccessResponse } from '@api/response';

export interface SignOutResult {
  message: string;
}

export type SignOutResponse = SuccessResponse<SignOutResult>;
