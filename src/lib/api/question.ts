import type { Panel } from './panel';
import type { SuccessResponse } from './types';

import { apiClient } from '../apiClient';

import { apiUrl } from './apiUrl';

export const getQuestions = async (
  panelId: Panel['id'],
  params: GetQuestionsParams,
): Promise<GetQuestionsResponse> =>
  apiClient.get<GetQuestionsResponse>(
    apiUrl.question.getQuestions(String(panelId)),
    params,
    undefined,
    false,
  );

/* ================================ [ 질문 목록 가져오기 API ] ====================================== */
export type GetQuestionsPathParams = Record<'panelId', string>;
export interface GetQuestionsParams {
  page: number;
  sort?: 'createdDate,DESC';
}
export interface GetQuestionsResult {
  questions: Question[];
  nextPage: number;
}
export type GetQuestionsResponse = SuccessResponse<GetQuestionsResult>;

/* ================================ [질문 엔티티] ====================================== */
export interface Question {
  id: number;
  content: string;
  answerNum: number;
  likeNum: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
