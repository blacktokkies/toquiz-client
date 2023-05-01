import React from 'react';

import { render } from '@testing-library/react';

import PanelList from '@/components/panel/PanelList';
import { myPanelsData } from '@/mocks/data/panel/myPanelsData';

describe('PanelList', () => {
  it('renders panels', () => {
    const { container } = render(<PanelList panels={myPanelsData} />);

    expect(container).toHaveTextContent(myPanelsData[0].title);
    expect(container).toHaveTextContent(myPanelsData[1].title);
  });
});
