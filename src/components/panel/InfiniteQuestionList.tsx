import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { useQuestionsInfiniteQuery } from '@/hooks/queries/question';

interface Props {
  panelId: Panel['id'];
}
export function InfiniteQuestionList({ panelId }: Props): JSX.Element {
  const questionsQuery = useQuestionsInfiniteQuery(panelId);

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
    </>
  );
}
