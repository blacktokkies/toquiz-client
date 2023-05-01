import React from 'react';

import { render } from '@testing-library/react';

import PanelList from '@/components/panel/PanelList';
import { myPanelData } from '@/mocks/data/panel/myPanelData';

describe('PanelList', () => {
  it('renders panels', () => {
    const { container } = render(<PanelList panels={myPanelData} />);

    expect(container).toHaveTextContent(myPanelData[0].title);
    expect(container).toHaveTextContent(myPanelData[1].title);
  });
});
