/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-throw-literal */

import type { Answer, GetAnswersResult } from '@/lib/api/answer';
import type { Panel as PanelData } from '@/lib/api/panel';
import type { Question, QuestionPage } from '@/lib/api/question';
import type { StompSubscription } from '@stomp/stompjs';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

import React, { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { produce } from 'immer';
import {
  useRouteError,
  json,
  isRouteErrorResponse,
  Link,
  useParams,
} from 'react-router-dom';

import { CreateQuestionModal } from '@/components/panel/CreateQuestionModal';
import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import { PanelHeader } from '@/components/panel/PanelHeader';
import { ModalController } from '@/components/system/ModalController';
import { useSocketClient } from '@/contexts/SocketClientContext';
import { activeInfoDetailQuery } from '@/hooks/queries/active-info';
import { panelDetailQuery, usePanelDetailQuery } from '@/hooks/queries/panel';
import { useOverlay } from '@/hooks/useOverlay';

import type { MyActiveInfo } from '@/lib/api/active-Info';

import { ApiError } from '@/lib/apiClient';
import { queryKey } from '@/lib/queryKey';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

// [NOTE] 로더 성공 반환값은 any 혹은 null로 고정한다
// [NOTE] 로더 실패 반환값은 `Response`로 고정한다
export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs): Promise<null> => {
    const panelId = params.panelId!;
    const panelQuery = panelDetailQuery(panelId);
    const activeInfoQuery = activeInfoDetailQuery(panelId);
    try {
      await queryClient.fetchQuery<PanelData>(panelQuery);
      await queryClient.fetchQuery<MyActiveInfo>(activeInfoQuery);
      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        const apiError = json(
          { ...error.data, id: panelId },
          {
            status: error.response.status,
          },
        );
        throw apiError;
      }
      throw error;
    }
  };

export function Component(): JSX.Element {
  const params = useParams<{ panelId: PanelData['sid'] }>();
  const panelId = params.panelId!;

  // [NOTE] 패널 페이지 로더에서 패널 정보 쿼리를 fetch하므로
  // 첫번째 렌더링 중에 데이터가 `undefined`가 아님이 보장된다
  const panel = usePanelDetailQuery(panelId, {
    refetchOnMount: false,
  }).data!;

  const queryClient = useQueryClient();
  const socketClient = useSocketClient();

  useEffect(() => {
    const handleCreateQuestion = (newQuestion: Question): void => {
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId),
        addQuestionAtLast(newQuestion),
      );

      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, 'createdDate,DESC'),
        addQuestionAtStart(newQuestion),
      );
    };

    const handleLikeQuestion = (
      questionId: Question['id'],
      likeNum: Question['likeNum'],
    ): void => {
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId),
        updateLikeNumAndSort(questionId, likeNum),
      );

      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, 'createdDate,DESC'),
        updateLikeNum(questionId, likeNum),
      );
    };

    const handleCreateAnswer = (
      questionId: Question['id'],
      newAnswer: Answer,
    ): void => {
      queryClient.setQueryData<GetAnswersResult>(
        queryKey.answer.list(questionId),
        addAnswer(newAnswer),
      );
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId),
        increaseAnswerNum(questionId),
      );
      queryClient.setQueryData<InfiniteData<QuestionPage>>(
        queryKey.question.list(panelId, 'createdDate,DESC'),
        increaseAnswerNum(questionId),
      );
    };

    let subscription: StompSubscription | null = null;
    socketClient.onConnect = () => {
      subscription = socketClient.subscribePanel(
        panelId,
        ({ eventType, data }) => {
          if (eventType === 'CREATE_QUESTION') {
            const newQuestion = data;
            handleCreateQuestion(newQuestion);
          } else if (eventType === 'LIKE_QUESTION') {
            const { questionId, likeNum } = data;
            handleLikeQuestion(questionId, likeNum);
          } else if (eventType === 'CREATE_ANSWER') {
            const { questionId, answer } = data;
            handleCreateAnswer(questionId, answer);
          }
        },
      );
    };

    socketClient.activate();

    return () => {
      if (subscription !== null) socketClient.unsubscribe(subscription.id);
      socketClient.deactivate();
    };
  }, [queryClient, socketClient, panelId]);

  const overlay = useOverlay();
  function openCreateQuestionModal(): void {
    overlay.open(({ close }) => (
      <ModalController close={close} aria-label="질문 생성 모달">
        <CreateQuestionModal close={close} panelId={panelId} />
      </ModalController>
    ));
  }

  return (
    <main className="flex flex-col h-full overflow-auto">
      <PanelHeader panel={panel} />
      <div className="flex-1 container flex flex-col max-w-2xl px-5 py-7">
        <InfiniteQuestionList panelId={panelId} />
      </div>
      <button
        className={clsx(
          'fixed bottom-0 right-0 m-7 p-3',
          'rounded-full bg-primary shadow-3xl',
          'hover:bg-primary-hover',
        )}
        type="button"
        onClick={openCreateQuestionModal}
      >
        <svg className="w-9 h-9 text-white">
          <use href={`${Icons}#send`} />
        </svg>
        <span className="sr-only">질문 생성 모달 열기</span>
      </button>
    </main>
  );
}

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      /* eslint-disable-next-line */
      const panelId = error.data.id;
      return (
        <div className="w-full h-full bg-gradient-to-r from-gray-50 to-slate-100">
          <div
            className={clsx(
              'flex flex-col gap-4 items-center pt-40 mx-auto px-8',
              'xs:flex-row xs:justify-center',
              'md:gap-7',
            )}
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold md:text-3xl">
                이런! 존재하지 않는 패널입니다
              </h1>
              <div className="text-grey-dark">
                <p>
                  <span className="font-semibold">[{panelId}]</span> 패널을 찾을
                  수 없습니다
                </p>
                새로고침하거나{' '}
                <Link to="/home" className="underline font-semibold">
                  홈 페이지
                </Link>
                로 돌아가세요
              </div>
            </div>
            <Link to="/home" className="underline font-semibold">
              <img
                src="/Logo.png"
                className="h-20 w-20 md:h-40 md:w-40"
                alt="toquiz 로고"
              />
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <main className="h-full bg-gradient-to-r from-gray-50 to-slate-100">
      <header className="border-b border-grey-light">
        <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
          <Link to="/" className="rounded-md font-bold">
            toquiz
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={clsx(
                'py-2 px-4 rounded-md font-medium',
                'hover:bg-grey-lighter focus:border-primary-hover ',
              )}
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className={clsx(
                'py-2 px-4 rounded-md border border-primary font-medium',
                'hover:border-primary-hover hover:opacity-70 focus:border-primary-hover',
              )}
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>
      <div className="h-36" />
      <div
        className={clsx(
          'container flex flex-col flex-1 items-center gap-4 max-w-xl px-8',
          'xs:flex-row xs:justify-center',
          'md:gap-7',
        )}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold md:text-3xl">
            이런! 알 수 없는 오류가 발생했습니다
          </h1>
          <div className="text-grey-dark">
            새로고침하거나{' '}
            <Link to="/" className="underline font-semibold hover:text-primary">
              시작 페이지
            </Link>
            로 돌아가세요
          </div>
        </div>
        <Link to="/" className="underline font-semibold">
          <img
            src="/Logo.png"
            className="h-20 w-20 md:h-40 md:w-40"
            alt="toquiz 로고"
          />
        </Link>
      </div>
    </main>
  );
}

const addQuestionAtLast =
  (newQuestion: Question) => (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages[draft.pages.length - 1].questions.push(newQuestion);
    });

const addQuestionAtStart =
  (newQuestion: Question) => (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages[0].questions.unshift(newQuestion);
    });

const updateLikeNum =
  (questionId: Question['id'], likeNum: Question['likeNum']) =>
  (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions.forEach((question) => {
          if (question.id === questionId) {
            question.likeNum = likeNum;
          }
        });
      });
    });

const updateLikeNumAndSort =
  (questionId: Question['id'], likeNum: Question['likeNum']) =>
  (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      const allQuestions = draft.pages.flatMap((page) => page.questions);
      const questionIdx = allQuestions.findIndex(
        (question) => question.id === questionId,
      );
      if (questionIdx !== -1) {
        allQuestions[questionIdx].likeNum = likeNum;
        allQuestions.sort((a, b) => b.likeNum - a.likeNum);
        draft.pages.forEach((page) => {
          page.questions = allQuestions.splice(0, 30);
        });
      }
    });

const increaseAnswerNum =
  (questionId: Question['id']) =>
  (prevQuestions?: InfiniteData<QuestionPage>) =>
    produce(prevQuestions, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.questions.forEach((question) => {
          if (question.id === questionId) {
            question.answerNum += 1;
          }
        });
      });
    });

const addAnswer = (newAnswer: Answer) => (prevAsnwers?: GetAnswersResult) =>
  produce(prevAsnwers, (draft) => {
    if (!draft) return;

    draft.answerNum += 1;
    draft.answers.unshift(newAnswer);
  });
