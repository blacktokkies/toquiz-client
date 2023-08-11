import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAllProviders } from '@/lib/test-utils';
import { myPanelList } from '@/mocks/data/panel';
import { Home } from '@/pages/Home';

describe('홈 페이지', () => {
  vi.mock('@/hooks/stores/useUserStore', () => ({
    useUserStore: vi.fn(() => ({
      nickname: '테스트 닉네임',
      email: '테스트 이메일',
      createdAt: new Date().toString(),
    })),
  }));

  it('내 패널 모아보기 헤딩을 보여준다.', () => {
    renderWithAllProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('내 패널 모아보기');
  });

  it('사용자의 닉네임을 보여준다.', () => {
    renderWithAllProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText(/테스트 닉네임/i)).toBeInTheDocument();
  });

  it('사용자가 작성한 패널의 목록을 보여준다.', async () => {
    renderWithAllProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByText(myPanelList[0].title)[0]).toBeInTheDocument();
    });
  });
});
