import React from 'react';

import { faker } from '@faker-js/faker';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as panelApis from '@/lib/api/panel';
import { renderWithQueryClient } from '@/lib/test-utils';

import { DeletePanelModal } from '../DeletePanelModal';

const handleClose = vi.fn();
const panelId = faker.datatype.uuid();

describe('DeletePanelModal', () => {
  it('패널 삭제하기 헤딩을 보여준다', () => {
    setup();

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 삭제하기/);
  });

  describe('패널 삭제 버튼을 누르면', () => {
    it('패널 삭제 API를 호출한다', async () => {
      const spyOnDeletePanel = vi.spyOn(panelApis, 'deletePanel');
      const { deleteButton } = setup();
      await userEvent.click(deleteButton);

      expect(spyOnDeletePanel).toHaveBeenCalled();
    });

    it('패널 삭제 API가 성공 응답 시 close 함수를 호출한다', async () => {
      const spyOnDeletePanel = vi.spyOn(panelApis, 'deletePanel');
      const { deleteButton } = setup();
      await userEvent.click(deleteButton);

      expect(spyOnDeletePanel).toHaveBeenCalled();

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  it('취소 버튼을 누르면 close 함수가 호출된다', async () => {
    const { closeButton } = setup();
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});

function setup(): {
  closeButton: HTMLButtonElement;
  deleteButton: HTMLButtonElement;
} {
  renderWithQueryClient(
    <DeletePanelModal close={handleClose} panelId={panelId} />,
  );

  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });
  const deleteButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /패널 삭제/,
  });
  return { closeButton, deleteButton };
}
