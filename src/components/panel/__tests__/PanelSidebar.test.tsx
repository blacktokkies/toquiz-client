import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { render, screen } from '@testing-library/react';

import { formatDateString } from '@/components/home/PanelItem';
import { PanelSidebar } from '@/components/panel/PanelSidebar';
import { createMockPanel } from '@/mocks/data/panel';

const panel: Panel = createMockPanel();

describe('PanelSidebar', () => {
  it('패널 제목, 패널 작성자, 패널 생성 날짜를 보여준다', () => {
    render(<PanelSidebar panel={panel} />);

    expect(screen.getByText(panel.title)).toBeInTheDocument();
    expect(screen.getByText(panel.author)).toBeInTheDocument();
    expect(
      screen.getByText(formatDateString(panel.createdAt)),
    ).toBeInTheDocument();
  });
});
