/* eslint-disable @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-throw-literal */

import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { clsx } from 'clsx';
import {
  useRouteError,
  json,
  isRouteErrorResponse,
  Link,
} from 'react-router-dom';

import { Logo } from '@/components/vectors';
import { getPanel } from '@/lib/api/panel';
import { ApiError } from '@/lib/apiClient';

// [NOTE] 로더 성공 반환값은 any 혹은 null로 고정한다
// [NOTE] 로더 실패 반환값은 `Response`로 고정한다
export const panelLoader: LoaderFunction = async ({ params }) => {
  const panelId = params.id!;
  try {
    const _panelId = Number(panelId);
    if (Number.isNaN(_panelId)) throw json({ id: panelId }, { status: 404 });
    const panel = await getPanel(_panelId);
    return panel;
  } catch (error) {
    if (error instanceof ApiError) {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
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

export function PanelError(): JSX.Element {
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

  return <div>알 수 없는 오류가 발생했습니다</div>;
}

export function Panel(): JSX.Element {
  return <div>패널 페이지</div>;
}
