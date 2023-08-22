import type { Panel } from '@/lib/api/panel';

import React, { useCallback } from 'react';

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
    <>
      <ul>
        {questionPages.map((questionPage) =>
          questionPage.questions.map((question) => (
            <li key={question.id}>{question.content}</li>
          )),
        )}
      </ul>
      <IntersectionArea onIntersection={fetchQuestions} />
    </>
  );
}
