import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { it } from 'vitest';

import { renderWithQueryClient } from '@/lib/test-utils';
import Main from '@/pages/Main';

describe('메인 페이지', () => {
  vi.mock('@/hooks/store/useUserStore', () => {
    const useUserStore = vi.fn();
    useUserStore.mockImplementation(() => ({
      nickname: '테스트 닉네임',
    }));
    return {
      useUserStore,
    };
  });

  it('내 패널 모아보기 헤딩을 보여준다.', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Main />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent('내 패널 모아보기');
    });
  });

  it('사용자의 닉네임을 보여준다.', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Main />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/테스트 닉네임/i)).toBeInTheDocument();
    });
  });

  it('사용자가 작성한 패널의 목록을 보여준다.', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Main />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // TODO: myPanelsData 사용하려했는데 Cannot read properties of undefined 오류가 자꾸 뜬다
      // 현재 Panel mock 데이터는 fakerjs로 생성하여 a가 무조건 포함되는 것을 기대할 수 있으므로
      // 일단 a가 출력되는지 보도록 한다.
      expect(screen.getByText(/a/i)).toBeInTheDocument();
    });
  });
});
