import type { SuccessResponse } from '../response';

export interface LikeQuestionBody {
  like: boolean;
}

export interface LikeQuestionResult {
  message: string;
}

export type LikeQuestionResponse = SuccessResponse<LikeQuestionResult>;
