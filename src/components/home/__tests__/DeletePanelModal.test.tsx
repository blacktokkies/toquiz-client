import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as panelApis from '@/lib/api/panel';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';

import { DeletePanelModal } from '../DeletePanelModal';

const handleClose = vi.fn();
function setup({ panel }: { panel: Panel }): {
  closeButton: HTMLButtonElement;
  deleteButton: HTMLButtonElement;
} {
  renderWithQueryClient(<DeletePanelModal close={handleClose} panel={panel} />);

  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });
  const deleteButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /패널 삭제/,
  });
  return { closeButton, deleteButton };
}

describe('DeletePanelModal', () => {
  it('패널 삭제하기 헤딩을 보여준다', () => {
    setup({ panel: createMockPanel() });

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 삭제하기/);
  });

  describe('패널 삭제 버튼을 누르면', () => {
    it('패널 삭제 API를 호출한다', async () => {
      const spyOnDeletePanel = vi.spyOn(panelApis, 'deletePanel');
      const { deleteButton } = setup({ panel: createMockPanel() });

      await userEvent.click(deleteButton);

      expect(spyOnDeletePanel).toHaveBeenCalled();
    });

    it('패널 삭제 API가 성공 응답 시 close 함수를 호출한다', async () => {
      const spyOnDeletePanel = vi.spyOn(panelApis, 'deletePanel');
      const { deleteButton } = setup({ panel: createMockPanel() });

      await userEvent.click(deleteButton);

      expect(spyOnDeletePanel).toHaveBeenCalled();

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  it('취소 버튼을 누르면 close 함수가 호출된다', async () => {
    const { closeButton } = setup({ panel: createMockPanel() });

    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
