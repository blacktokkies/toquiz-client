import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { HomeHeader } from '@/components/home/HomeHeader';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';

describe('HomeHeader', () => {
  it('홈 페이지 헤더를 보여준다', () => {
    renderWithQueryClient(
      <MemoryRouter>
        <OverlayProvider>
          <HomeHeader />
        </OverlayProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('내 계정 아이콘을 누르면 계정 액션 메뉴를 보여준다', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <OverlayProvider>
          <HomeHeader />
        </OverlayProvider>
      </MemoryRouter>,
    );

    const accountButton = screen.getByRole('button', {
      name: /내 계정/,
    });
    await userEvent.click(accountButton);

    expect(screen.getByRole('dialog', { name: /내 계정 액션 메뉴/ }));
  });
});
