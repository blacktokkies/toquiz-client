import type { Panel } from '@/lib/api/panel';
import type * as Vi from 'vitest';

import React from 'react';

import { faker } from '@faker-js/faker';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UpdatePanelModal } from '@/components/home/UpdatePanelModal';
import * as panelApis from '@/lib/api/panel';
import { renderWithQueryClient } from '@/lib/test-utils';
import { isPanelDescription, isPanelTitle } from '@/lib/validator';

vi.mock('@/lib/validator', () => ({
  isPanelTitle: vi.fn(),
  isPanelDescription: vi.fn(),
}));

const handleClose = vi.fn();

const panel: Panel = {
  id: faker.datatype.uuid(),
  author: 'test@email.com',
  title: '테스트 패널 제목',
  description: '테스트 패널 설명',
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
};

describe('UpdatePanelModal', () => {
  it('패널 수정하기 헤딩을 보여준다', () => {
    renderWithQueryClient(
      <UpdatePanelModal close={handleClose} panel={panel} />,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 수정하기/);
  });

  it('패널 수정하기 폼이 초기값을 보여준다', () => {
    const { titleInput, descInput } = setup();

    expect(titleInput.value).toBe('테스트 패널 제목');
    expect(descInput.value).toBe('테스트 패널 설명');
  });

  it('취소 버튼을 누르면 close 함수가 호출된다', async () => {
    const { closeButton } = setup();
    await userEvent.click(closeButton);

    expect(handleClose).toBeCalled();
  });

  it('유효하지 않은 필드값을 입력하면 에러 메시지를 보여준다', () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => false);
    const { titleInput } = setup();
    fireEvent.change(titleInput, {
      target: { value: '유효하지 않은 패널 제목' },
    });

    expect(
      screen.getByText(/패널 제목은 3 ~ 40자이어야 합니다/),
    ).toBeInTheDocument();
  });

  it('유효한 필드값을 제출하면 패널 수정 API를 호출하고 close 함수를 호출한다', async () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => true);
    (isPanelDescription as Vi.Mock).mockImplementation(() => true);
    const spyOnUpdatePanel = vi.spyOn(panelApis, 'updatePanel');

    const { titleInput, descInput, submitButton } = setup();
    fireEvent.change(titleInput, {
      target: { value: '유효한 패널 제목' },
    });
    fireEvent.change(descInput, {
      target: { value: '유효한 패널 설명' },
    });

    await userEvent.click(submitButton);

    expect(spyOnUpdatePanel).toHaveBeenCalledWith(panel.id, {
      title: '유효한 패널 제목',
      description: '유효한 패널 설명',
    });

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('패널 제목과 패널 설명 모두 초기값과 같은 필드값을 제출하면 에러 메시지를 보여준다', async () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => true);
    (isPanelDescription as Vi.Mock).mockImplementation(() => true);
    const spyOnUpdatePanel = vi.spyOn(panelApis, 'updatePanel');

    const { titleInput, descInput, submitButton } = setup();
    fireEvent.change(titleInput, {
      target: { value: panel.title },
    });
    fireEvent.change(descInput, {
      target: { value: panel.description },
    });

    await userEvent.click(submitButton);

    expect(spyOnUpdatePanel).not.toHaveBeenCalled();
    expect(screen.getByText(/수정된 패널 제목을 입력해주세요/));
    expect(screen.getByText(/수정된 패널 설명을 입력해주세요/));
  });
});

function setup(): {
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  closeButton: HTMLButtonElement;
  submitButton: HTMLButtonElement;
} {
  renderWithQueryClient(<UpdatePanelModal close={handleClose} panel={panel} />);

  const titleInput = screen.getByRole<HTMLInputElement>('textbox', {
    name: /패널 제목/,
  });
  const descInput = screen.getByRole<HTMLInputElement>('textbox', {
    name: /패널 설명/,
  });
  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });
  const submitButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /패널 수정/,
  });

  return { titleInput, descInput, closeButton, submitButton };
}
