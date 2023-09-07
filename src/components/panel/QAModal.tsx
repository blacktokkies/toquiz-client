import type { GetAnswersResult } from '@/lib/api/answer';
import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';
import type { ChangeEvent } from 'react';

import React, { useRef, useState, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { produce } from 'immer';
import { flushSync } from 'react-dom';
import { useRouteLoaderData } from 'react-router-dom';

import { Button } from '@/components/system/Button';
import { ArrowBack, Account, Like } from '@/components/vectors';
import { useSocketClient } from '@/contexts/SocketClientContext';
import {
  useAnswersQuery,
  useCreateAnswerMutation,
} from '@/hooks/queries/answer';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { formatDistance } from '@/lib/format-date';
import { queryKey } from '@/lib/queryKey';

interface Props {
  close: () => void;
  questionId: Question['id'];
  onLikeButtonClick: () => void;
  isActived: boolean;
}

let id = 0;
export function QAModal({
  close,
  questionId,
  onLikeButtonClick,
  isActived,
}: Props): JSX.Element {
  const userId = useUserStore((state) => state.id);
  // [NOTE] 질문과 답변 모달은 패널 페이지에서만 사용되므로
  // 패널 페이지 로더가 반환하는 데이터가 null이 아님이 보장된다
  const panelLoaderData = useRouteLoaderData('panel') as Panel;
  const now = useCurrentDate();
  const answersQuery = useAnswersQuery(questionId);

  const [expanded, setExpanded] = useState(false);
  const formContainer = useRef<HTMLDivElement | null>(null);
  function handleFormOutsideClick(): void {
    if (content.length <= 0) setExpanded(false);
  }
  useOutsideClick(formContainer, handleFormOutsideClick);

  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRefCallback = useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (node) {
        textareaRef.current = node;
        if (expanded) textareaRef.current.focus();
      }
    },
    [expanded],
  );

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    flushSync(() => {
      setContent(e.target.value);
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  const socketClient = useSocketClient();
  const queryClient = useQueryClient();
  const createAnswerMutation = useCreateAnswerMutation<{
    prevAnswers: GetAnswersResult | undefined;
  }>(questionId, {
    onMutate: async (content) => {
      await queryClient.cancelQueries(queryKey.question.lists());
      await queryClient.cancelQueries(queryKey.answer.list(questionId));

      const prevAnswers = queryClient.getQueryData<GetAnswersResult>(
        queryKey.answer.list(questionId),
      );
      queryClient.setQueryData<GetAnswersResult>(
        queryKey.answer.list(questionId),
        (old) =>
          produce(old, (draft) => {
            if (!draft) return;

            draft.answerNum += 1;
            draft.answers.push({
              id: id--,
              content,
              createdAt: new Date().toString(),
              updatedAt: new Date().toString(),
            });
          }),
      );

      return { prevAnswers };
    },
    onSuccess: (newAnswer) => {
      socketClient.publish({
        destination: `/pub/panels/${panelLoaderData.sid}`,
        body: JSON.stringify({
          domain: 'answer',
          method: 'create',
          result: { ...newAnswer, questionId },
        }),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey.answer.list(questionId));
    },
  });

  if (panelLoaderData === undefined) return <></>;

  const { author, ...panel } = panelLoaderData;

  // TODO: Fallback UI 제공하기
  if (answersQuery.isLoading) return <div>loading</div>;
  if (answersQuery.isError) return <div>error</div>;

  const { answers, ...question } = answersQuery.data;
  return (
    <div
      role="dialog"
      aria-label="질문과 답변 모달"
      className="fixed inset-0 flex flex-col gap-6 overflow-auto justify-start bg-white"
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
          ref={formContainer}
          className={clsx(
            'flex flex-col mx-2 py-3 border shadow-md',
            'py-3 px-4 border border-grey-light outline-none rounded-md',
            'hover:shadow-xl focus:border-2 focus:border-primary',
          )}
          role="button"
          tabIndex={0}
          aria-label="답변 생성 폼 열기"
          aria-expanded={expanded}
          onClick={() => {
            setExpanded(true);
          }}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' ||
              event.keyCode === 13 ||
              event.key === 'Space' ||
              event.keyCode === 32
            ) {
              event.preventDefault();
              setExpanded(true);
            }
          }}
        >
          {expanded && (
            <span className="ml-auto text-grey-dark">
              <span
                className={
                  content.length > 200 ? 'text-danger' : 'text-inherit'
                }
              >
                {content.length}
              </span>
              /200자
              <span className="sr-only">{content.length}자를 입력했습니다</span>
            </span>
          )}
          <form aria-label="답변 생성 폼" aria-hidden={!expanded}>
            <textarea
              tabIndex={expanded ? 0 : -1}
              ref={textareaRefCallback}
              rows={1}
              className={clsx(
                'w-full rounded-md outline-none resize-none overflow-hidden p-1',
                'text-md text-grey-darkest placeholder:text-grey',
              )}
              placeholder="답변을 입력하세요"
              value={content}
              onChange={handleChange}
            />
          </form>
          {expanded && (
            <div className="flex gap-4 justify-end items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  setContent('');
                  setExpanded(false);
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={content.length === 0 || content.length > 200}
                onClick={(event) => {
                  event.stopPropagation();
                  createAnswerMutation.mutate(content, {
                    onSuccess: () => {
                      setContent('');
                      setExpanded(false);
                    },
                  });
                }}
              >
                답변 생성
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="flex-1">
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
