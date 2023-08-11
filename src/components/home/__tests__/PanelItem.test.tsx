import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelItem } from '@/components/home/PanelItem';
import { myPanelList } from '@/mocks/data/panel';

const panel: Panel = {
  id: faker.datatype.uuid(),
  author: 'test@email.com',
  title: '테스트 패널 제목',
  description: '테스트 패널 설명',
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
};

describe('PanelItem', () => {
  it('패널 제목과 설명을 렌더링한다', () => {
    render(<PanelItem panel={panel} />);

    expect(screen.getByText(/패널 제목/)).toBeInTheDocument();
    expect(screen.getByText(/패널 설명/)).toBeInTheDocument();
  });

  it('더보기 아이콘을 누르면 패널 액션 메뉴를 보여준다', async () => {
    render(<PanelItem panel={myPanelList[0]} />);

    const moreButton = screen.getByRole('button', { name: /더보기/ });
    await userEvent.click(moreButton);

    expect(screen.getByRole('dialog', { name: '패널 액션 메뉴' }));
  });
});
