import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { screen } from '@testing-library/react';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';
import { Panel } from '@/pages/Panel';

const panel: PanelData = createMockPanel();

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useLoaderData: vi.fn(() => panel) };
});

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
