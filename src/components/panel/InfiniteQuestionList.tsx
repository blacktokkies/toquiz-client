import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Panel } from '@/lib/api/panel';
import type {
  GetQuestionsParams,
  Question,
  QuestionPage,
} from '@/lib/api/question';
import type { InfiniteData } from '@tanstack/react-query';

import React, { useCallback, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { produce } from 'immer';

import { useSocketClient } from '@/contexts/SocketClientContext';
import { activeInfoDetailQuery } from '@/hooks/queries/active-info';
import {
  useLikeQuestionMutation,
  useQuestionsInfiniteQuery,
} from '@/hooks/queries/question';
import { ApiError } from '@/lib/apiClient';
import { queryKey } from '@/lib/queryKey';

import { IntersectionArea } from '../system/IntersectionArea';

import { QuestionList } from './QuestionList';

interface Props {
  panelId: Panel['sid'];
}
type Sort = GetQuestionsParams['sort'];
export function InfiniteQuestionList({ panelId }: Props): JSX.Element {
  const [sort, setSort] = useState<Sort>(undefined);
  const questionsQuery = useQuestionsInfiniteQuery(panelId, sort);
  const fetchQuestions = useCallback(
    (isIntersecting: boolean) => {
      if (
        isIntersecting &&
        !questionsQuery.isFetchingNextPage &&
        questionsQuery.hasNextPage
      )
        questionsQuery.fetchNextPage();
    },
    [questionsQuery],
  );

  const socketClient = useSocketClient();
  const queryClient = useQueryClient();
  const likeQuestionMutation = useLikeQuestionMutation<{
    prevQuestions: InfiniteData<QuestionPage> | undefined;
    prevActiveInfo: MyActiveInfo | undefined;
  }>({
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries(queryKey.question.lists());

      const prevQuestions = queryClient.getQueryData<
        InfiniteData<QuestionPage>
      >(queryKey.question.list(panelId, sort));
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, sort),
        updateQuestion(id, active),
      );

      const prevActiveInfo = queryClient.getQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
      );
      queryClient.setQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
        updateLikedList(id, active),
      );

      return { prevActiveInfo, prevQuestions };
    },
    onSuccess: ({ id, likeNum }) => {
      socketClient.publish({
        destination: `/pub/panels/${panelId}`,
        body: JSON.stringify({
          domain: 'question',
          method: 'like',
          result: {
            id,
            likeNum,
          },
        }),
      });
    },
    onError: (err, variables, context) => {
      if (err instanceof SyntaxError) return;
      if (!(err instanceof ApiError)) return;
      if (err.data === undefined) return;

      const { statusCode, code } = err.data;

      if (statusCode === 400) {
        if (
          code === 'INVALID_ACTIVE_LIKE_QUESTION' ||
          code === 'INVALID_INACTIVE_LIKE_QUESTION'
        ) {
          queryClient.setQueryData<InfiniteData<QuestionPage>>(
            queryKey.question.list(panelId, sort),
            context?.prevQuestions,
          );
          queryClient.setQueryData<MyActiveInfo>(
            queryKey.activeInfo.detail(panelId),
            context?.prevActiveInfo,
          );
        }
      } else if (statusCode === 404) {
        if (code === 'NOT_EXIST_QUESTION') {
          queryClient.setQueryData<InfiniteData<QuestionPage>>(
            queryKey.question.list(panelId, sort),
            removeQuestion(variables.id),
          );
          queryClient.setQueryData<MyActiveInfo>(
            queryKey.activeInfo.detail(panelId),
            removeQuestionFromLikedList(variables.id),
          );
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey.question.lists());
    },
  });

  // [NOTE] 패널 페이지 로더에서 active info query를 `staleTime: Infinity`로 prefetch하므로
  // active info query의 데이터가 fresh하다는 것이 보장된다
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const activeInfoQuery = useQuery(activeInfoDetailQuery(panelId)).data!;
  const handleLikeButtonClick = (question: Question) => () => {
    likeQuestionMutation.mutate({
      id: question.id,
      active: !activeInfoQuery.likedIds.includes(question.id),
    });
  };

  // TODO: fallback UI 제공
  if (questionsQuery.isLoading) return <div>loading</div>;
  if (questionsQuery.isError) return <div>error</div>;

  const questionPages = questionsQuery.data.pages;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <button
          className={clsx(
            'p-2 rounded-md text-grey-dark text-sm hover:bg-grey-lighter active:opacity-80',
            {
              'text-grey-darkest font-medium': sort === undefined,
            },
          )}
          type="button"
          onClick={() => {
            setSort(undefined);
          }}
        >
          좋아요순
        </button>
        <div className="w-[1px] bg-grey-dark h-4" />
        <button
          className={clsx(
            'p-2 rounded-md text-grey-dark text-sm hover:bg-grey-lighter active:opacity-80',
            {
              'text-grey-darkest font-medium': sort !== undefined,
            },
          )}
          type="button"
          onClick={() => {
            setSort('createdDate,DESC');
          }}
        >
          최신순
        </button>
      </div>
      <QuestionList
        questionPages={questionPages}
        onLikeButtonClick={handleLikeButtonClick}
        likeIds={activeInfoQuery.likedIds}
      />
      <IntersectionArea onIntersection={fetchQuestions} />
    </div>
  );
}

// TODO: mutate할 때 page id 받아서 for문 없애기
const updateQuestion =
  (questionId: Question['id'], active: boolean) =>
  (prevQuestions: InfiniteData<QuestionPage> | undefined) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions.forEach((question) => {
          if (question.id === questionId) {
            if (active) question.likeNum += 1;
            else question.likeNum -= 1;
          }
        });
      });
    });

const removeQuestion =
  (questionId: Question['id']) =>
  (prevQuestions: InfiniteData<QuestionPage> | undefined) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions = page.questions.filter(
          (question) => question.id !== questionId,
        );
      });
    });

const updateLikedList =
  (questionId: Question['id'], active: boolean) =>
  (prevActiveInfo: MyActiveInfo | undefined) =>
    produce(prevActiveInfo, (draft) => {
      if (!draft) return;

      if (active) {
        draft.likedIds.push(questionId);
      } else {
        draft.likedIds = draft.likedIds.filter(
          (likeId) => likeId !== questionId,
        );
      }
    });

const removeQuestionFromLikedList =
  (questionId: Question['id']) => (prevActiveInfo: MyActiveInfo | undefined) =>
    produce(prevActiveInfo, (draft) => {
      if (!draft) return;

      draft.likedIds = draft.likedIds.filter((likeId) => likeId !== questionId);
    });
