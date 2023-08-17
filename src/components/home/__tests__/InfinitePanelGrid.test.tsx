import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';

import { InfinitePanelGrid } from '../InfinitePanelGrid';

describe('InfinitePanelGrid', () => {
  it('패널 생성 버튼을 누르면 패널 생성 모달이 열린다', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <OverlayProvider>
          <InfinitePanelGrid />
        </OverlayProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/)).not.toBeInTheDocument();
    });

    const openButton = screen.getByRole('button', { name: /패널 생성/ });
    await userEvent.click(openButton);

    expect(screen.getByRole('dialog', { name: '패널 생성 모달' }));
  });
});
