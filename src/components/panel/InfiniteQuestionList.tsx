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

import { activeInfoDetailQuery } from '@/hooks/queries/active-info';
import {
  useLikeQuestionMutation,
  useQuestionsInfiniteQuery,
} from '@/hooks/queries/question';
import { queryKey } from '@/lib/queryKey';

import { IntersectionArea } from '../system/IntersectionArea';

import { QuestionList } from './QuestionList';

interface Props {
  panelId: Panel['id'];
}
type Sort = GetQuestionsParams['sort'];
export function InfiniteQuestionList({ panelId }: Props): JSX.Element {
  const [sort, setSort] = useState<Sort>(undefined);
  const questionsQuery = useQuestionsInfiniteQuery(panelId, sort);
  const queryClient = useQueryClient();
  const likeQuestionMutation = useLikeQuestionMutation({
    onMutate: async ({ active, id }) => {
      const val = active ? 1 : -1;
      await queryClient.cancelQueries(queryKey.question.lists());
      const prevQuestion = queryClient.getQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, sort),
      );
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, sort),
        (old) => {
          if (old === undefined) return;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              questions: page.questions.map((question) =>
                question.id === id
                  ? { ...question, likeNum: question.likeNum + val }
                  : question,
              ),
            })),
          };
        },
      );
      const prevActiveInfo = queryClient.getQueryData(
        activeInfoDetailQuery(panelId).queryKey,
      );
      queryClient.setQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
        (old) => {
          if (old === undefined) return undefined;
          return {
            ...old,
            likedIds: active
              ? [...old.likedIds, id]
              : old.likedIds.filter((likeId) => likeId !== id),
          };
        },
      );

      return { prevActiveInfo, prevQuestion };
    },
    onSettled: (res) => {
      if (res === undefined) return;
      queryClient.invalidateQueries(queryKey.question.lists());
    },
  });

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const activeInfoQuery = useQuery(activeInfoDetailQuery(panelId)).data!;

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
