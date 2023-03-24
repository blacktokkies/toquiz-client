import React from 'react';

import { render } from '@testing-library/react';

import PanelList from '@/components/panel/PanelList';
import { myPanelData } from '@/mocks/data/panel/myPanelData';

describe('PanelList', () => {
  it('renders panels', () => {
    const { container } = render(<PanelList panels={myPanelData} />);

    expect(container).toHaveTextContent('무엇이든 물어보세요');
    expect(container).toHaveTextContent('세계 역사 이야기');
  });
});
