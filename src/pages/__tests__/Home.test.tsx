import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import { mockMyPanelList } from '@/mocks/data/panel';
import { Component as Home } from '@/pages/Home';

vi.mock('@/hooks/stores/useUserStore', () => ({
  useUserStore: () => ({
    email: '테스트 이메일',
    nickname: '테스트 닉네임',
    createdAt: new Date().toString(),
  }),
}));
describe('홈 페이지', () => {
  it('내 패널 모아보기 헤딩을 보여준다.', () => {
    setup();

    expect(screen.getByRole('heading')).toHaveTextContent('내 패널 모아보기');
  });

  it('사용자의 닉네임을 보여준다.', () => {
    setup();

    expect(screen.getByText(/테스트 닉네임/i)).toBeInTheDocument();
  });

  it('사용자가 작성한 패널의 목록을 보여준다.', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.getAllByText(mockMyPanelList[0].title)[0],
      ).toBeInTheDocument();
    });
  });
});

function setup(): void {
  renderWithQueryClient(
    <MemoryRouter>
      <OverlayProvider>
        <Home />
      </OverlayProvider>
    </MemoryRouter>,
  );
}
