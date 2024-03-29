import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { GetAnswersResult } from '@/lib/api/answer';
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
import { produce } from 'immer';

import { QAModal } from '@/components/panel/QAModal';
import { useSocketClient } from '@/contexts/SocketClientContext';
import {
  activeInfoDetailQuery,
  useActiveInfoDetailQuery,
} from '@/hooks/queries/active-info';
import { useLikeQuestionMutation } from '@/hooks/queries/question';
import { useOverlay } from '@/hooks/useOverlay';
import { ApiError } from '@/lib/apiClient';
import { queryKey } from '@/lib/queryKey';

import { QuestionItem } from './QuestionItem';

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
  // [NOTE] 패널 페이지 로더에서 활동 정보 쿼리를 fetch하므로
  // 첫번째 렌더링 중에 데이터가 `undefined`가 아님이 보장된다
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const activeInfo = useActiveInfoDetailQuery(panelId, {
    refetchOnMount: false,
  }).data!;
  const likeSet = new Set(activeInfo.likedIds);

  const socketClient = useSocketClient();
  const queryClient = useQueryClient();
  const likeQuestionMutation = useLikeQuestionMutation<{
    prevQuestions: InfiniteData<QuestionPage> | undefined;
    prevActiveInfo: MyActiveInfo | undefined;
    prevAnswers: GetAnswersResult | undefined;
  }>({
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries(queryKey.question.lists());

      const prevQuestions = queryClient.getQueryData<
        InfiniteData<QuestionPage>
      >(queryKey.question.list(panelId, sort));

      if (sort === 'createdDate,DESC') {
        queryClient.setQueryData<InfiniteData<QuestionPage>>(
          queryKey.question.list(panelId, sort),
          updateQuestion(id, active),
        );
      } else {
        queryClient.setQueryData<InfiniteData<QuestionPage>>(
          queryKey.question.list(panelId, sort),
          updateQuestionAndSort(id, active),
        );
      }

      const prevAnswers = queryClient.getQueryData<GetAnswersResult>(
        queryKey.answer.list(id),
      );
      queryClient.setQueryData<GetAnswersResult>(
        queryKey.answer.list(id),
        updateAnswers(active),
      );

      const prevActiveInfo = queryClient.getQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
      );
      queryClient.setQueryData<MyActiveInfo>(
        activeInfoDetailQuery(panelId).queryKey,
        updateLikedList(id, active),
      );

      return { prevActiveInfo, prevQuestions, prevAnswers };
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
          queryClient.setQueryData<GetAnswersResult>(
            queryKey.answer.list(variables.id),
            context?.prevAnswers,
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
          queryClient.setQueryData<GetAnswersResult>(
            queryKey.answer.list(variables.id),
            undefined,
          );
        }
      }
    },
  });

  const handleLikeButtonClick = (
    question: Question,
    isActived: boolean,
  ): void => {
    likeQuestionMutation.mutate({
      id: question.id,
      active: !isActived,
    });
  };

  const overlay = useOverlay();
  function openQAModal(question: Question): void {
    overlay.open(({ close }) => (
      <QAModal
        close={close}
        panelId={panelId}
        questionId={question.id}
        onLikeButtonClick={handleLikeButtonClick}
      />
    ));
  }

  const handleQuestionItemClick =
    (question: Question) => (event: MouseEvent<HTMLDivElement>) => {
      openQAModal(question);
    };

  const handleQuestionItemKeydown =
    (question: Question) => (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        openQAModal(question);
      }
    };

  const now = new Date();

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
                onClick={handleQuestionItemClick(question)}
                onKeyDown={handleQuestionItemKeydown(question)}
                tabIndex={0}
              >
                <QuestionItem
                  question={question}
                  isActived={isActived}
                  now={now}
                  onLikeButtonClick={(e) => {
                    e.stopPropagation();
                    handleLikeButtonClick(question, isActived);
                  }}
                />
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

const updateQuestionAndSort =
  (questionId: Question['id'], active: boolean) =>
  (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      const allQuestions = draft.pages.flatMap((page) => page.questions);
      const questionIdx = allQuestions.findIndex(
        (question) => question.id === questionId,
      );
      if (questionIdx !== -1) {
        if (active) allQuestions[questionIdx].likeNum += 1;
        else allQuestions[questionIdx].likeNum -= 1;
        allQuestions.sort((a, b) => b.likeNum - a.likeNum);
        draft.pages.forEach((page) => {
          page.questions = allQuestions.splice(0, 30);
        });
      }
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

const updateAnswers =
  (active: boolean) => (prevAnswers: GetAnswersResult | undefined) =>
    produce(prevAnswers, (draft) => {
      if (!draft) return;

      if (active) draft.likeNum += 1;
      else draft.likeNum -= 1;
    });
