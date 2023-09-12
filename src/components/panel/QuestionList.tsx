import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Question, QuestionPage } from '@/lib/api/question';
import type { KeyboardEvent, MouseEvent } from 'react';

import React from 'react';

import { clsx } from 'clsx';

import { QAModal } from '@/components/panel/QAModal';
import { Like, Account } from '@/components/vectors';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useOverlay } from '@/hooks/useOverlay';
import { formatDistance } from '@/lib/format-date';

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
  const overlay = useOverlay();

  function openModal(question: Question): void {
    overlay.open(({ close }) => (
      <QAModal
        close={close}
        questionId={question.id}
        isActived={likeSet.has(question.id)}
        onLikeButtonClick={onLikeButtonClick(question)}
      />
    ));
  }

  const handleQuestionItemClick =
    (question: Question) => (event: MouseEvent<HTMLDivElement>) => {
      openModal(question);
    };

  const handleQuestionItemKeydown =
    (question: Question) => (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        openModal(question);
      }
    };

  return (
    <ul className="flex flex-col gap-3">
      {questionPages.map((questionPage) =>
        questionPage.questions.map((question) => {
          const isActived = likeSet.has(question.id);
          return (
            <li key={question.id}>
              <div
                role="button"
                aria-label="질문과 답변 모달 열기"
                className="flex flex-col gap-3 p-5 w-full border border-grey-light rounded-md"
                onClick={handleQuestionItemClick(question)}
                onKeyDown={handleQuestionItemKeydown(question)}
                tabIndex={0}
              >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeButtonClick(question)();
                    }}
                  >
                    <Like className="w-5 h-5" />
                    {question.likeNum}
                  </button>
                </div>
                <div className="whitespace-pre-wrap">{question.content}</div>
              </div>
            </li>
          );
        }),
      )}
    </ul>
  );
}
