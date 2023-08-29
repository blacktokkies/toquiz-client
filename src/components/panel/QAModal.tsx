import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';

import React, { useRef, useState } from 'react';

import { clsx } from 'clsx';
import { useRouteLoaderData } from 'react-router-dom';

import { ArrowBack, Account, Like } from '@/components/vectors';
import { useAnswersQuery } from '@/hooks/queries/answer';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { formatDistance } from '@/lib/format-date';

interface Props {
  close: () => void;
  questionId: Question['id'];
  onLikeButtonClick: () => void;
  isActived: boolean;
}

export function QAModal({
  close,
  questionId,
  onLikeButtonClick,
  isActived,
}: Props): JSX.Element {
  const userId = useUserStore((state) => state.id);
  // [NOTE] 질문과 답변 모달은 패널 페이지에서만 사용되므로
  // 패널 페이지 로더가 반환하는 데이터가 null이 아님이 보장된다
  const { author, ...panel } = useRouteLoaderData('panel') as Panel;
  const now = useCurrentDate();
  const answersQuery = useAnswersQuery(questionId);

  const [expanded, setExpanded] = useState(false);

  const formContainer = useRef<HTMLDivElement | null>(null);
  function handleFormOutsideClick(): void {
    setExpanded(false);
  }
  useOutsideClick(formContainer, handleFormOutsideClick);
  // TODO: Fallback UI 제공하기
  if (answersQuery.isLoading) return <div>loading</div>;
  if (answersQuery.isError) return <div>error</div>;

  const { answers, ...question } = answersQuery.data;
  return (
    <div
      role="dialog"
      aria-label="질문과 답변 모달"
      className="fixed inset-0 flex flex-col overflow-auto justify-start bg-white"
    >
      <header className="flex justify-start items-center gap-2 bg-primary-dark shadow-md px-3 min-h-[64px]">
        <button type="button" className="rounded-full p-1" onClick={close}>
          <ArrowBack className="fill-white" />
          <span className="sr-only">뒤로 가기</span>
        </button>
        <span className="text-white">{panel.title}</span>
      </header>
      <div className="flex flex-col gap-3 p-5 w-full border-y border-grey-light">
        <div className="flex items-center justify-between">
          <div className="flex justify-start items-center gap-1 overflow-hidden">
            <div role="img" aria-hidden>
              <Account className="fill-grey-darkest" />
            </div>
            <div className="font-bold whitespace-nowrap">익명</div>
            <div className="text-grey-dark">
              {formatDistance(now, new Date(question.createdAt))}
            </div>
            {question.answerNum ? (
              <span className="ml-1 px-3 rounded-2xl bg-primary text-white text-sm">
                답변 {question.answerNum}개
              </span>
            ) : null}
          </div>
          <button
            aria-label={`좋아요 버튼, 좋아요 ${question.likeNum}개`}
            aria-pressed={isActived}
            className={clsx(
              'flex itesm-center gap-2 py-1 px-2 rounded-2xl border-2 text-sm',
              isActived
                ? 'border-green font-bold text-green bg-green-light fill-green hover:bg-green-lighter active:opacity-80'
                : 'border-grey-light text-grey-dark fill-grey-dark hover:bg-grey-lighter active:opacity-80',
            )}
            type="button"
            onClick={onLikeButtonClick}
          >
            <Like className="w-5 h-5" />
            {question.likeNum}
          </button>
        </div>
        <div>{question.content}</div>
      </div>
      {userId === author.id && (
        <div
          role="button"
          tabIndex={0}
          data-testid="answer-form-container"
          aria-expanded={expanded}
          onClick={() => {
            setExpanded(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
              event.preventDefault();
              setExpanded(true);
            }
          }}
        >
          <form aria-label="답변 생성 폼" />
        </div>
      )}
      <div className="flex-1 py-6">
        <ul>
          {answers.map((answer) => (
            <li
              key={answer.id}
              className="flex flex-col gap-3 p-5 w-full border-y border-grey-light"
            >
              <div className="flex items-center justify-between">
                <div className="flex justify-start items-center gap-1 overflow-hidden">
                  <div role="img" aria-hidden>
                    <Account className="fill-grey-darkest" />
                  </div>
                  <div className="font-bold whitespace-nowrap">
                    {author.nickname}
                  </div>
                  <div className="text-grey-dark">
                    {formatDistance(now, new Date(answer.createdAt))}
                  </div>
                </div>
              </div>
              <div>{answer.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
