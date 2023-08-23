import type { Panel } from '@/lib/api/panel';

import React, { useCallback } from 'react';

import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';

import { Account } from '@/components/vectors';
import { useQuestionsInfiniteQuery } from '@/hooks/queries/question';

import { IntersectionArea } from '../system/IntersectionArea';

interface Props {
  panelId: Panel['id'];
}
export function InfiniteQuestionList({ panelId }: Props): JSX.Element {
  const questionsQuery = useQuestionsInfiniteQuery(panelId);

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
  // TODO: fallback UI 제공
  if (questionsQuery.isLoading) return <div>loading</div>;
  if (questionsQuery.isError) return <div>error</div>;

  const questionPages = questionsQuery.data.pages;
  const now = new Date();
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {questionPages.map((questionPage) =>
          questionPage.questions.map((question) => (
            <li
              key={question.id}
              className="flex flex-col gap-3 p-5 w-full border border-grey-light rounded-md"
            >
              <div className="flex justify-start items-center gap-1 overflow-hidden">
                <div role="img" aria-label="내 계정 아이콘">
                  <Account className="fill-grey-darkest" />
                </div>
                <div className="font-bold whitespace-nowrap">익명</div>
                <div className="text-grey-dark">
                  {formatTimeDifference(now, new Date(question.createdAt))}
                </div>
              </div>
              <div>{question.content}</div>
            </li>
          )),
        )}
      </ul>
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
