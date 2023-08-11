import React from 'react';

import { screen } from '@testing-library/react';

import { UpdatePanelActionModal } from '@/components/home/UpdatePanelActionModal';
import { renderWithQueryClient } from '@/lib/test-utils';

const handleClose = vi.fn();
describe('UpdatePanelModal', () => {
  it('패널 수정하기 헤딩을 보여준다', () => {
    renderWithQueryClient(<UpdatePanelActionModal close={handleClose} />);

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 수정하기/);
  });
});
