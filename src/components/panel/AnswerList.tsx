import type { Answer } from '@/lib/api/answer';

import React from 'react';

import { Account } from '@/components/vectors';
import { formatDistance } from '@/lib/format-date';

interface Props {
  nickname: string;
  answers: Answer[];
  now: Date;
}
export function AnswerList({ nickname, answers, now }: Props): JSX.Element {
  return (
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
              <div className="font-bold whitespace-nowrap">{nickname}</div>
              <div className="text-grey-dark">
                {formatDistance(now, new Date(answer.createdAt))}
              </div>
            </div>
          </div>
          <div className="whitespace-pre-wrap">{answer.content}</div>
        </li>
      ))}
    </ul>
  );
}
