import type { Question } from '@/lib/api/question';
import type { MouseEvent } from 'react';

import React from 'react';

import { clsx } from 'clsx';

import { Like, Account } from '@/components/vectors';
import { formatDistance } from '@/lib/format-date';

interface Props {
  question: Question;
  isActived: boolean;
  onLikeButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
  now: Date;
}

export function QuestionItem({
  question,
  isActived,
  onLikeButtonClick,
  now,
}: Props): JSX.Element {
  return (
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
      <div className="whitespace-pre-wrap">{question.content}</div>
    </div>
  );
}
