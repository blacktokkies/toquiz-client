import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Panel } from '@/lib/api/panel';
import type {
  Question,
  QuestionPage,
  GetQuestionsParams,
} from '@/lib/api/question';
import type { LikeQuestionEvent } from '@/lib/socketClient';
import type { InfiniteData } from '@tanstack/react-query';
import type { KeyboardEvent, MouseEvent } from 'react';

import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { produce } from 'immer';

import { QAModal } from '@/components/panel/QAModal';
import { Like, Account } from '@/components/vectors';
import { useSocketClient } from '@/contexts/SocketClientContext';
import {
  activeInfoDetailQuery,
  useActiveInfoDetailQuery,
} from '@/hooks/queries/active-info';
import { useLikeQuestionMutation } from '@/hooks/queries/question';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { useOverlay } from '@/hooks/useOverlay';
import { ApiError } from '@/lib/apiClient';
import { formatDistance } from '@/lib/format-date';
import { queryKey } from '@/lib/queryKey';

interface Props {
  panelId: Panel['sid'];
  sort: GetQuestionsParams['sort'];
  questionPages: QuestionPage[];
}

export function QuestionList({
  panelId,
  sort,
  questionPages,
}: Props): JSX.Element {
  const now = useCurrentDate();
  // [NOTE] 패널 페이지 로더에서 활동 정보 디테일 쿼리를 `staleTime: Infinity`로 prefetch하므로
  // 패널 페이지 렌더링 중에는 활동 정보 디테일 쿼리의 데이터가 언제나 fresh하다는 것이 보장된다
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const activeInfo = useActiveInfoDetailQuery(panelId).data!;
  const likeSet = new Set(activeInfo.likedIds);
  const socketClient = useSocketClient();
  const queryClient = useQueryClient();
  const likeQuestionMutation = useLikeQuestionMutation<{
    prevQuestions: InfiniteData<QuestionPage> | undefined;
    prevActiveInfo: MyActiveInfo | undefined;
  }>({
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries(queryKey.question.lists());

      const prevQuestions = queryClient.getQueryData<
        InfiniteData<QuestionPage>
      >(queryKey.question.list(panelId, sort));
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, sort),
        updateQuestion(id, active),
      );

      const prevActiveInfo = queryClient.getQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
      );
      queryClient.setQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
        updateLikedList(id, active),
      );

      return { prevActiveInfo, prevQuestions };
    },
    onSuccess: ({ id, likeNum }) => {
      socketClient.publishToPanel<LikeQuestionEvent>(panelId, {
        eventType: 'LIKE_QUESTION',
        data: {
          questionId: id,
          likeNum,
        },
      });
    },
    onError: (err, variables, context) => {
      if (err instanceof SyntaxError) return;
      if (!(err instanceof ApiError)) return;
      if (err.data === undefined) return;

      const { statusCode, code } = err.data;

      if (statusCode === 400) {
        if (
          code === 'INVALID_ACTIVE_LIKE_QUESTION' ||
          code === 'INVALID_INACTIVE_LIKE_QUESTION'
        ) {
          queryClient.setQueryData<InfiniteData<QuestionPage>>(
            queryKey.question.list(panelId, sort),
            context?.prevQuestions,
          );
          queryClient.setQueryData<MyActiveInfo>(
            queryKey.activeInfo.detail(panelId),
            context?.prevActiveInfo,
          );
        }
      } else if (statusCode === 404) {
        if (code === 'NOT_EXIST_QUESTION') {
          queryClient.setQueryData<InfiniteData<QuestionPage>>(
            queryKey.question.list(panelId, sort),
            removeQuestion(variables.id),
          );
          queryClient.setQueryData<MyActiveInfo>(
            queryKey.activeInfo.detail(panelId),
            removeQuestionFromLikedList(variables.id),
          );
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey.question.lists());
    },
  });
  const handleLikeButtonClick = (question: Question) => () => {
    likeQuestionMutation.mutate({
      id: question.id,
      active: !activeInfo.likedIds.includes(question.id),
    });
  };

  const overlay = useOverlay();
  function openModal(question: Question): void {
    overlay.open(({ close }) => (
      <QAModal
        close={close}
        questionId={question.id}
        isActived={likeSet.has(question.id)}
        onLikeButtonClick={handleLikeButtonClick(question)}
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
                      handleLikeButtonClick(question)();
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

// TODO: mutate할 때 page id 받아서 for문 없애기
const updateQuestion =
  (questionId: Question['id'], active: boolean) =>
  (prevQuestions: InfiniteData<QuestionPage> | undefined) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions.forEach((question) => {
          if (question.id === questionId) {
            if (active) question.likeNum += 1;
            else question.likeNum -= 1;
          }
        });
      });
    });

const removeQuestion =
  (questionId: Question['id']) =>
  (prevQuestions: InfiniteData<QuestionPage> | undefined) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions = page.questions.filter(
          (question) => question.id !== questionId,
        );
      });
    });

const updateLikedList =
  (questionId: Question['id'], active: boolean) =>
  (prevActiveInfo: MyActiveInfo | undefined) =>
    produce(prevActiveInfo, (draft) => {
      if (!draft) return;

      if (active) {
        draft.likedIds.push(questionId);
      } else {
        draft.likedIds = draft.likedIds.filter(
          (likeId) => likeId !== questionId,
        );
      }
    });

const removeQuestionFromLikedList =
  (questionId: Question['id']) => (prevActiveInfo: MyActiveInfo | undefined) =>
    produce(prevActiveInfo, (draft) => {
      if (!draft) return;

      draft.likedIds = draft.likedIds.filter((likeId) => likeId !== questionId);
    });
