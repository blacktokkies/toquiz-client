import React from 'react';

import { render } from '@testing-library/react';

import PanelItem from '@/components/panel/PanelItem';
import { myPanelsData } from '@/mocks/data/panel/myPanelsData';

describe('PanelItem', () => {
  it('패널 제목과 만든 날짜를 렌더링한다', () => {
    const { container } = render(<PanelItem panel={myPanelsData[0]} />);

    const { title, createdAt } = myPanelsData[0];
    expect(container).toHaveTextContent(title);
    expect(container).toHaveTextContent(
      new Date(createdAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );
  });
});
