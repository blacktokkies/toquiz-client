import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { faker } from '@faker-js/faker';
import { screen } from '@testing-library/react';

import { UpdatePanelActionModal } from '@/components/home/UpdatePanelActionModal';
import { renderWithQueryClient } from '@/lib/test-utils';

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
});

function setup(): {
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
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

  return { titleInput, descInput };
}
