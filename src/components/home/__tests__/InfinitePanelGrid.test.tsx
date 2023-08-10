import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@/lib/test-utils';

import { InfinitePanelGrid } from '../InfinitePanelGrid';

describe('InfinitePanelGrid', () => {
  it('패널 생성 버튼을 누르면 패널 생성 모달이 열린다', async () => {
    renderWithAllProviders(<InfinitePanelGrid />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/)).not.toBeInTheDocument();
    });

    const openButton = screen.getByRole('button');
    await userEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '패널 생성 모달' }));
    });
  });
});
