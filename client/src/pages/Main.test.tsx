import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { renderWithQueryClient } from '@/lib/test-utils';
import Main from '@/pages/Main';

describe('메인 페이지', () => {
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
