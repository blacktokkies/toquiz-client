import type { Panel } from '@/lib/api/panel';
import type * as Vi from 'vitest';

import React from 'react';

import { faker } from '@faker-js/faker';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UpdatePanelActionModal } from '@/components/home/UpdatePanelActionModal';
import { renderWithQueryClient } from '@/lib/test-utils';
import { isPanelTitle } from '@/lib/validator';

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
      <UpdatePanelActionModal close={handleClose} panel={panel} />,
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
});

function setup(): {
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  closeButton: HTMLButtonElement;
} {
  renderWithQueryClient(
    <UpdatePanelActionModal close={handleClose} panel={panel} />,
  );

  const titleInput = screen.getByRole<HTMLInputElement>('textbox', {
    name: /패널 제목/,
  });
  const descInput = screen.getByRole<HTMLInputElement>('textbox', {
    name: /패널 설명/,
  });
  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });

  return { titleInput, descInput, closeButton };
}
