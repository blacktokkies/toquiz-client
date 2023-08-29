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

export type CreateAnswerPathParams = Record<'questionId', string>;
export interface CreateAnswerBody {
  content: Answer['content'];
}
export interface CreateAnswerResult {
  id: Answer['id'];
  content: Answer['content'];
  createdAt: Answer['createdAt'];
  updatedAt: Answer['updatedAt'];
}
export type CreateAnswerResponse = SuccessResponse<CreateAnswerResult>;

export const createAnswer = async (
  questionId: Question['id'],
  content: Answer['content'],
): Promise<CreateAnswerResponse> =>
  apiClient.post<CreateAnswerResponse, CreateAnswerBody>(
    apiUrl.answer.create(String(questionId)),
    { content },
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
