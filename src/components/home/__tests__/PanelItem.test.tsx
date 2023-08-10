import React from 'react';

import { render } from '@testing-library/react';

import { PanelItem, formatDateString } from '@/components/home/PanelItem';
import { myPanelList } from '@/mocks/data/panel';

describe('PanelItem', () => {
  it('패널 제목과 만든 날짜를 렌더링한다', () => {
    const { container } = render(<PanelItem panel={myPanelList[0]} />);

    const { title, createdAt } = myPanelList[0];
    expect(container).toHaveTextContent(title);
    expect(container).toHaveTextContent(formatDateString(createdAt));
  });
});
