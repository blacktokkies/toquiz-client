import type { GetMyPanelsResult } from '@/mocks/handlers/panel';

import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanleList } from '@/mocks/data/panel';

import { PanelGrid } from '../PanelGrid';

describe('PanelGrid', () => {
  it('패널 목록을 렌더링한다', () => {
    const panelPages: GetMyPanelsResult[] = [
      { panels: createMockPanleList(10), cursor: undefined },
    ];
    renderWithQueryClient(<PanelGrid panelPages={panelPages} />);

    expect(screen.getByText(panelPages[0].panels[0].title)).toBeInTheDocument();
  });
});