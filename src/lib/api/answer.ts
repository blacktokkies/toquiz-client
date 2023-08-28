import type { Question } from './question';
import type { SuccessResponse } from './types';

import { apiClient } from '../apiClient';

import { apiUrl } from './apiUrl';

export const getAnswers = async (
  questionId: Question['id'],
): Promise<GetAnswersResponse> =>
  apiClient.get<GetAnswersResponse>(
    apiUrl.answer.getAnswers(String(questionId)),
    {
      needAuthorization: false,
    },
  );

export type GetAnswersPathParams = Record<'questionId', string>;
export type GetAnswersResult = Question & {
  answers: Answer[];
};
export type GetAnswersResponse = SuccessResponse<GetAnswersResult>;
export interface Answer {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
