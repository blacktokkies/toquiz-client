import type { GetMyPanelsResult } from '@/lib/api/panel';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelGrid } from '@/components/home/PanelGrid';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel, createMockPanleList } from '@/mocks/data/panel';

const navigateMockFn = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => navigateMockFn),
}));

vi.mock('@/hooks/useOverlay', () => ({ useOverlay: vi.fn() }));

describe('PanelGrid', () => {
  it('패널 목록을 렌더링한다', () => {
    const panelPages: GetMyPanelsResult[] = [
      { panels: createMockPanleList(10) },
    ];
    renderWithQueryClient(<PanelGrid panelPages={panelPages} />);

    expect(
      screen.getAllByText(panelPages[0].panels[0].title)[0],
    ).toBeInTheDocument();
  });

  it('패널 목록이 없으면 안내 문구를 보여준다', () => {
    renderWithQueryClient(<PanelGrid panelPages={[]} />);

    expect(screen.getByText(/아직 작성한 패널이 없습니다/)).toBeInTheDocument();
  });

  it('패널 제목을 누르면 해당 아이디의 패널 페이지로 이동한다', async () => {
    const panel = createMockPanel();
    const panelPages: GetMyPanelsResult[] = [{ panels: [panel] }];
    renderWithQueryClient(<PanelGrid panelPages={panelPages} />);

    const title = screen.getByText(panel.title);
    await userEvent.click(title);

    expect(navigateMockFn).toHaveBeenCalledWith(`/panel/${panel.id}`);
  });
});
