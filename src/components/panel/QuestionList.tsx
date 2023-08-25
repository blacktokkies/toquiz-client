import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Question, QuestionPage } from '@/lib/api/question';

import React from 'react';

import { clsx } from 'clsx';
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';

import { Account, Like } from '@/components/vectors';
import { useCurrentDate } from '@/hooks/useCurrentDate';

interface Props {
  questionPages: QuestionPage[];
  onLikeButtonClick: (question: Question) => () => void;
  likeIds: MyActiveInfo['likedIds'];
}
export function QuestionList({
  questionPages,
  onLikeButtonClick,
  likeIds,
}: Props): JSX.Element {
  const now = useCurrentDate();
  const likeSet = new Set(likeIds);

  return (
    <ul className="flex flex-col gap-3">
      {questionPages.map((questionPage) =>
        questionPage.questions.map((question) => {
          const isActived = likeSet.has(question.id);
          return (
            <li
              key={question.id}
              className="flex flex-col gap-3 p-5 w-full border border-grey-light rounded-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex justify-start items-center gap-1 overflow-hidden">
                  <div role="img" aria-label="내 계정 아이콘">
                    <Account className="fill-grey-darkest" />
                  </div>
                  <div className="font-bold whitespace-nowrap">익명</div>
                  <div className="text-grey-dark">
                    {formatTimeDifference(now, new Date(question.createdAt))}
                  </div>
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
                  onClick={onLikeButtonClick(question)}
                >
                  <Like className="w-5 h-5" />

                  {question.likeNum}
                </button>
              </div>
              <div>{question.content}</div>
            </li>
          );
        }),
      )}
    </ul>
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
