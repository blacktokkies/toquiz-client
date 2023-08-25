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
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';

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

/**
 * 날짜 차이를 계산한다
 * @param now 현재
 * @param target 과거
 * @returns 차이가 1분 이내이면 방금, 1시간 이내이면 n분 전, 하루 이내이면 n시간 전, 일주일 이내이면 n일 전, 한 달 이내이면 n주 전, 이후로는 n달 전
 */
export function formatTimeDifference(now: Date, target: Date): string {
  const minutesDiff = differenceInMinutes(now, target);

  if (minutesDiff === 0) return '방금';
  if (minutesDiff < 60) return `${minutesDiff}분 전`;

  const hoursDiff = differenceInHours(now, target);
  if (hoursDiff < 24) return `${hoursDiff}시간 전`;

  const daysDiff = differenceInDays(now, target);
  if (daysDiff < 7) return `${daysDiff}일 전`;

  const weeksDiff = differenceInWeeks(now, target);
  const monthsDiff = differenceInMonths(now, target);
  if (monthsDiff < 2) return `${weeksDiff}주 전`;
  return `${monthsDiff}달 전`;
}
