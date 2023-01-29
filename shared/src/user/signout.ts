import { SuccessResponse } from '../response';

export interface SignOutResult {
  message: string;
}

export type SignOutResponse = SuccessResponse<SignOutResult>;
