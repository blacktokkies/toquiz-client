/* eslint-disable @typescript-eslint/unbound-method */
import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelSidebar } from '@/components/panel/PanelSidebar';
import { formatToKRLocaleString } from '@/lib/format-date';
import { createMockPanel } from '@/mocks/data/panel';

const panel: Panel = createMockPanel();

describe('PanelSidebar', () => {
  it('패널 제목, 패널 작성자, 패널 생성 날짜를 보여준다', () => {
    render(<PanelSidebar panel={panel} />);

    expect(screen.getByText(panel.title)).toBeInTheDocument();
    expect(screen.getByText(panel.author)).toBeInTheDocument();
    expect(
      screen.getByText(formatToKRLocaleString(panel.createdAt)),
    ).toBeInTheDocument();
  });

  it('패널 URL 복사하기 버튼을 누르면 사용자가 패널 URL을 복사한다', async () => {
    render(<PanelSidebar panel={panel} />);
    const copyUrlButton = screen.getByRole('button', {
      name: /패널 URL 복사하기/,
    });

    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn(async () => Promise.resolve()),
      },
    });

    await userEvent.click(copyUrlButton);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/panel/${panel.id}`,
    );
  });
});
