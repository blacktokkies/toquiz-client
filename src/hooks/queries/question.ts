import type { Panel } from '@/lib/api/panel';
import type {
  CreateQuestionBody,
  CreateQuestionResult,
  GetQuestionsParams,
  QuestionPage,
  LikeQuestionError,
  LikeQuestionParams,
  LikeQuestionResult,
  Question,
} from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type {
  UseMutationOptions,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { createQuestion, getQuestions, likeQuestion } from '@/lib/api/question';
import { queryKey } from '@/lib/queryKey';

/* ================================ [ 질문 목록 쿼리 ] ====================================== */
export type QuestionsInfiniteQuery = NonNullableKeys<
  Pick<
    UseInfiniteQueryOptions<QuestionPage, ApiError | SyntaxError, QuestionPage>,
    'queryFn' | 'queryKey' | 'getNextPageParam'
  >
>;
export const questionsInfiniteQuery = (
  panelId: Panel['sid'],
  sort: GetQuestionsParams['sort'],
): QuestionsInfiniteQuery => ({
  queryKey: queryKey.question.list(panelId, sort),
  queryFn: async ({ pageParam = 0 }) =>
    (
      await getQuestions(panelId, {
        page: pageParam as GetQuestionsParams['page'],
        sort,
      })
    ).result,
  getNextPageParam: (lastPage) =>
    lastPage.nextPage !== -1 ? lastPage.nextPage : undefined,
});
export const useQuestionsInfiniteQuery = (
  panelId: Panel['sid'],
  sort: GetQuestionsParams['sort'] = undefined,
  options: UseInfiniteQueryOptions<QuestionPage, ApiError | SyntaxError> = {},
): UseInfiniteQueryResult<QuestionPage, ApiError | SyntaxError> =>
  useInfiniteQuery({ ...questionsInfiniteQuery(panelId, sort), ...options });

/* ================================ [ 질문 생성 뮤테이션 ] ====================================== */
export type CreateQuestionMutation = NonNullableKeys<
  Pick<
    UseMutationOptions<
      CreateQuestionResult,
      ApiError | SyntaxError,
      CreateQuestionBody
    >,
    'mutationKey' | 'mutationFn'
  >
>;
export const createQuestionMutation = (
  panelId: Panel['sid'],
): CreateQuestionMutation => ({
  mutationKey: queryKey.question.create(),
  mutationFn: async (body) =>
    createQuestion(panelId, body).then((res) => res.result),
});
export const useCreateQuestionMutation = <TContext = unknown>(
  panelId: Panel['sid'],
  options: UseMutationOptions<
    CreateQuestionResult,
    ApiError | SyntaxError,
    CreateQuestionBody,
    TContext
  > = {},
): UseMutationResult<
  CreateQuestionResult,
  ApiError | SyntaxError,
  CreateQuestionBody,
  TContext
> => useMutation({ ...createQuestionMutation(panelId), ...options });

/* ================================ [ 질문 좋아요 뮤테이션 ] ====================================== */
export type LikeQuestionMutation = NonNullableKeys<
  Pick<
    UseMutationOptions<
      LikeQuestionResult,
      ApiError | SyntaxError,
      { id: Question['id']; active: LikeQuestionParams['active'] },
      ReturnType<typeof queryKey.question.like>
    >,
    'mutationFn' | 'mutationKey'
  >
>;
export const likeQuestionMutation = (): LikeQuestionMutation => ({
  mutationKey: queryKey.question.like(),
  mutationFn: async ({ id, active }) =>
    likeQuestion(id, { active }).then((res) => res.result),
});

export const useLikeQuestionMutation = <TContext = unknown>(
  options: UseMutationOptions<
    LikeQuestionResult,
    ApiError<LikeQuestionError> | SyntaxError,
    { id: Question['id']; active: LikeQuestionParams['active'] },
    TContext
  > = {},
): UseMutationResult<
  LikeQuestionResult,
  ApiError<LikeQuestionError> | SyntaxError,
  { id: Question['id']; active: LikeQuestionParams['active'] },
  TContext
> =>
  useMutation<
    LikeQuestionResult,
    ApiError<LikeQuestionError> | SyntaxError,
    { id: Question['id']; active: LikeQuestionParams['active'] },
    TContext
  >({ ...likeQuestionMutation(), ...options });
