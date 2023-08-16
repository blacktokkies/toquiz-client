import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { render, screen } from '@testing-library/react';

import { createMockPanel } from '@/mocks/data/panel';
import { Panel } from '@/pages/Panel';

const panel: PanelData = createMockPanel();

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useLoaderData: vi.fn(() => panel) };
});

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    render(<Panel />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('헤더에서 패널 이름을 보여준다', () => {
    render(<Panel />);

    expect(screen.getByRole('heading')).toHaveTextContent(panel.title);
  });
});
