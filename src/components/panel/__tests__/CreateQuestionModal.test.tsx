import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { faker } from '@faker-js/faker';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateQuestionModal } from '@/components/panel/CreateQuestionModal';
import * as questionApis from '@/lib/api/question';
import { renderWithQueryClient } from '@/lib/test-utils';

const panelId: Panel['sid'] = faker.datatype.uuid();
const handleClose = vi.fn();

describe('CreatePanelModal', () => {
  it('사용자가 입력하는 글자수를 보여준다', async () => {
    const { user, questionInput } = setup();
    await user.type(questionInput, '안녕하세요');

    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('사용자가 0자 혹은 200자 초과로 입력하면 제출 버튼을 비활성화한다', async () => {
    const { user, questionInput, submitButton } = setup();
    await user.type(questionInput, ' ');
    expect(submitButton.disabled).toBe(true);
    fireEvent.change(questionInput, {
      target: { value: '글'.repeat(200 + 1) },
    });

    expect(submitButton.disabled).toBe(true);
  });

  it('사용자가 1자 이상 200자 이하를 입력하면 제출 버튼을 활성화한다', async () => {
    const { user, questionInput, submitButton } = setup();
    await user.type(questionInput, '안녕하세요');

    expect(submitButton.disabled).toBe(false);
  });

  it('질문을 제출하면 질문 생성 API를 호출한다', async () => {
    const spyOnCreateQuestion = vi.spyOn(questionApis, 'createQuestion');
    const { user, questionInput, submitButton } = setup();
    await user.type(questionInput, '안녕하세요');
    await user.click(submitButton);

    expect(spyOnCreateQuestion).toHaveBeenCalledWith(panelId, {
      content: '안녕하세요',
    });
  });

  it('질문 생성 성공 시 close 함수를 호출한다', async () => {
    const { user, questionInput, submitButton } = setup();
    await user.type(questionInput, '안녕하세요');
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('취소 버튼을 누르면 close 함수를 호출한다', async () => {
    const { user, closeButton } = setup();
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});

function setup(): {
  user: ReturnType<typeof userEvent.setup>;
  questionInput: HTMLTextAreaElement;
  submitButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
} {
  const user = userEvent.setup();
  renderWithQueryClient(
    <CreateQuestionModal panelId={panelId} close={handleClose} />,
  );

  const questionInput = screen.getByRole<HTMLTextAreaElement>('textbox');
  const submitButton = screen.getByRole<HTMLButtonElement>('button', {
    name: '질문 생성',
  });
  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });

  return { user, questionInput, submitButton, closeButton };
}
