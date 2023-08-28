import type { Question } from '@/lib/api/question';

import React from 'react';

import { clsx } from 'clsx';

import { ArrowBack, Account, Like } from '@/components/vectors';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { formatDistance } from '@/lib/format-date';

interface Props {
  close: () => void;
  question: Question;
  onLikeButtonClick: () => void;
  isActived: boolean;
}

export function QAModal({
  close,
  question,
  onLikeButtonClick,
  isActived,
}: Props): JSX.Element {
  const now = useCurrentDate();

  return (
    <div
      role="dialog"
      aria-label="질문과 답변 모달"
      className="fixed inset-0 bg-white"
    >
      <header className="flex justify-start items-center bg-primary-dark shadow-md px-3 h-16">
        <button type="button" className="rounded-full p-1" onClick={close}>
          <ArrowBack className="fill-white" />
          <span className="sr-only">뒤로 가기</span>
        </button>
      </header>
      <div className="flex flex-col gap-3 p-5 w-full border border-grey-light rounded-md">
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
    </div>
  );
}
