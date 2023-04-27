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
      expect(screen.getByText('테스트 닉네임')).toBeInTheDocument();
    });
  });

  it('사용자가 작성한 패널의 목록을 보여준다.', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <Main />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('무엇이든 물어보세요')).toBeInTheDocument();
    });
  });
});
