/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-throw-literal */

import type { Panel as PanelData } from '@/lib/api/panel';
import type { StompSubscription } from '@stomp/stompjs';
import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

import React, { useEffect } from 'react';

import { Client } from '@stomp/stompjs';
import { clsx } from 'clsx';
import {
  useRouteError,
  json,
  isRouteErrorResponse,
  Link,
  useLoaderData,
} from 'react-router-dom';
import Socket from 'sockjs-client';

import { CreateQuestionModal } from '@/components/panel/CreateQuestionModal';
import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import { PanelHeader } from '@/components/panel/PanelHeader';
import { ModalController } from '@/components/system/ModalController';
import { Send, Logo } from '@/components/vectors';
import { activeInfoDetailQuery } from '@/hooks/queries/active-info';
import { panelDetailQuery } from '@/hooks/queries/panel';
import { useOverlay } from '@/hooks/useOverlay';
import { ApiError } from '@/lib/apiClient';

// [NOTE] 로더 성공 반환값은 any 혹은 null로 고정한다
// [NOTE] 로더 실패 반환값은 `Response`로 고정한다
export const panelLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs): Promise<PanelData> => {
    const panelId = params.id!;
    const panelQuery = panelDetailQuery(panelId);
    try {
      const panel =
        queryClient.getQueryData<PanelData>(panelQuery.queryKey) ??
        (await queryClient.fetchQuery<PanelData>(panelQuery));
      await queryClient.prefetchQuery(activeInfoDetailQuery(panelId));
      return panel;
    } catch (error) {
      if (error instanceof ApiError) {
        throw json(
          { ...error.data, id: panelId },
          {
            status: error.response.status,
          },
        );
      }
      throw error;
    }
  };

export function Panel(): JSX.Element {
  const panel = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof panelLoader>>
  >;
  const overlay = useOverlay();

  useEffect(() => {
    let subscription: StompSubscription;
    const client = new Client({
      webSocketFactory: () => new Socket('/ws'),
      debug: (msg) => {
        console.log(msg);
      },
      onConnect: () => {
        subscription = client.subscribe(
          `/sub/panels/${panel.sid}`,
          (message) => {
            const { body } = message;
            console.log(JSON.parse(body));
          },
        );
      },
    });
    client.activate();

    return () => {
      client.unsubscribe(subscription.id);
      client.deactivate();
    };
  }, [panel.sid]);

  function handleOpenModal(): void {
    overlay.open(({ close }) => (
      <ModalController close={close} aria-label="질문 생성 모달">
        <CreateQuestionModal close={close} panelId={panel.sid} />
      </ModalController>
    ));
  }
  return (
    <main className="flex flex-col h-full overflow-auto">
      <PanelHeader panel={panel} />
      <div className="flex-1 container flex flex-col max-w-2xl px-5 py-7">
        <InfiniteQuestionList panelId={panel.sid} />
      </div>
      <button
        className={clsx(
          'fixed bottom-0 right-0 m-7 p-3',
          'rounded-full bg-primary shadow-3xl',
          'hover:bg-primary-hover',
        )}
        type="button"
        onClick={handleOpenModal}
      >
        <Send className="w-9 h-9 fill-white" />
        <span className="sr-only">질문 생성 모달 열기</span>
      </button>
    </main>
  );
}

export function PanelErrorBoundary(): JSX.Element {
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
              <div role="img" aria-label="toquiz 로고">
                <Logo className="h-20 w-20 md:h-40 md:w-40" />
              </div>
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
          <div role="img" aria-label="toquiz 로고">
            <Logo className="h-20 w-20 md:h-40 md:w-40" />
          </div>
        </Link>
      </div>
    </main>
  );
}
