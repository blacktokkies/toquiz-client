import type { Panel } from '@/lib/api/panel';

import React, { useCallback } from 'react';

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
                <div className="text-grey-dark">{question.createdAt}</div>
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
