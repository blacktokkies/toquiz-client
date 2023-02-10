import { type SuccessResponse } from '@api/response';

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;
