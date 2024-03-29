import type { Panel } from './panel';
import type { SuccessResponse } from './types';

import { apiClient } from '../apiClient';

import { apiUrl } from './apiUrl';

export const getQuestions = async (
  panelId: Panel['sid'],
  params: GetQuestionsParams,
): Promise<GetQuestionsResponse> =>
  apiClient.get<GetQuestionsResponse>(apiUrl.question.getQuestions(panelId), {
    params,
    needAuthorization: false,
  });

export const createQuestion = async (
  panelId: Panel['sid'],
  body: CreateQuestionBody,
): Promise<CreateQuestionResponse> =>
  apiClient.post<CreateQuestionResponse>(
    apiUrl.question.create(panelId),
    body,
    {
      needAuthorization: false,
    },
  );

export const likeQuestion = async (
  questionId: Question['id'],
  params: LikeQuestionParams,
): Promise<LikeQuestionResponse> =>
  apiClient.post<LikeQuestionResponse>(
    apiUrl.question.like(String(questionId)),
    undefined,
    {
      params,
      needAuthorization: false,
    },
  );
/* ================================ [ 질문 목록 가져오기 API ] ====================================== */
export type GetQuestionsPathParams = Record<'panelId', string>;
export interface GetQuestionsParams {
  page: number;
  sort?: 'createdDate,DESC';
}
export interface QuestionPage {
  questions: Question[];
  nextPage: number;
}
export type GetQuestionsResult = QuestionPage;
export type GetQuestionsResponse = SuccessResponse<GetQuestionsResult>;

/* ================================ [ 질문 생성 가져오기 API ] ====================================== */
export type CreateQuestionPathParams = Record<'panelId', string>;
export interface CreateQuestionBody {
  content: Question['content'];
}
export type CreateQuestionResult = Question;
export type CreateQuestionResponse = SuccessResponse<CreateQuestionResult>;

/* ================================ [ 질문 좋아요 API ] ====================================== */
export interface LikeQuestionParams {
  active: boolean;
}
export type LikeQuestionPathParams = Record<'questionId', string>;
export interface LikeQuestionResult {
  id: Question['id'];
  likeNum: Question['likeNum'];
  isActived: boolean;
}
export type LikeQuestionResponse = SuccessResponse<LikeQuestionResult>;
export type LikeQuestionError =
  | InvalidLikeQuestionError
  | NotExistLikeQuestionError;
export interface InvalidLikeQuestionError {
  code: 'INVALID_ACTIVE_LIKE_QUESTION' | 'INVALID_INACTIVE_LIKE_QUESTION';
  statusCode: 400;
}
export interface NotExistLikeQuestionError {
  code: 'NOT_EXIST_QUESTION';
  statusCode: 404;
}
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
