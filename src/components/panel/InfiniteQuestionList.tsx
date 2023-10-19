import type { Panel } from '@/lib/api/panel';
import type { GetQuestionsParams } from '@/lib/api/question';

import React, { useCallback, useState } from 'react';

import { clsx } from 'clsx';

import { IntersectionArea } from '@/components/system/IntersectionArea';
import { useQuestionsInfiniteQuery } from '@/hooks/queries/question';

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
        panelId={panelId}
        sort={sort}
        questionPages={questionPages}
      />
      <IntersectionArea onIntersection={fetchQuestions} />
    </div>
  );
}
