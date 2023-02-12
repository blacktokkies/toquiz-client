import { type SuccessResponse } from '@api/response';

export interface SignUpBody {
  username: string;
  password: string;
  nickname: string;
}

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;
