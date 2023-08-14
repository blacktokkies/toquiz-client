import type { GetMyPanelsResult } from '@/lib/api/panel';

import React from 'react';

import { screen } from '@testing-library/react';

import { PanelGrid } from '@/components/home/PanelGrid';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanleList } from '@/mocks/data/panel';

describe('PanelGrid', () => {
  it('패널 목록을 렌더링한다', () => {
    const panelPages: GetMyPanelsResult[] = [
      { panels: createMockPanleList(10), cursor: undefined },
    ];
    renderWithQueryClient(
      <OverlayProvider>
        <PanelGrid panelPages={panelPages} />
      </OverlayProvider>,
    );

    expect(
      screen.getAllByText(panelPages[0].panels[0].title)[0],
    ).toBeInTheDocument();
  });

  it('패널 목록이 없으면 안내 문구를 보여준다', () => {
    renderWithQueryClient(
      <OverlayProvider>
        <PanelGrid panelPages={[]} />
      </OverlayProvider>,
    );

    expect(screen.getByText(/아직 작성한 패널이 없습니다/)).toBeInTheDocument();
  });
});
