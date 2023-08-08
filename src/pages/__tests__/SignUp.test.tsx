import type { ErrorResponse } from '@/lib/api/response';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';

import { apiUrl } from '@/lib/apiUrl';
import { renderWithQueryClient } from '@/lib/test-utils';
import { server } from '@/mocks/server';
import Signup from '@/pages/SignUp';

function overrideSignUpResultWith(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.auth.signup(), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

describe('회원가입 페이지', () => {
  it('중복된 이메일을 제출하면 에러 메시지를 보여준다', async () => {
    vi.mock('@/lib/validator', () => ({
      isEmail: vi.fn().mockImplementation(() => true),
      isNickname: vi.fn().mockImplementation(() => true),
      isPassword: vi.fn().mockImplementation(() => true),
    }));

    overrideSignUpResultWith({
      code: 'DUPLICATE_EMAIL',
      statusCode: 400,
      message: '이미 존재하는 email 입니다.',
    });

    renderWithQueryClient(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: '회원가입' });
    await userEvent.click(submitButton);

    expect(screen.getByText(/이미 존재하는 email 입니다/)).toBeInTheDocument();
  });

  it('중복된 닉네임을 제출하면 에러 메시지를 보여준다', async () => {
    vi.mock('@/lib/validator', () => ({
      isEmail: vi.fn().mockImplementation(() => true),
      isNickname: vi.fn().mockImplementation(() => true),
      isPassword: vi.fn().mockImplementation(() => true),
    }));

    overrideSignUpResultWith({
      code: 'DUPLICATE_NICKNAME',
      statusCode: 400,
      message: '이미 존재하는 nickname 입니다.',
    });

    renderWithQueryClient(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: '회원가입' });
    await userEvent.click(submitButton);

    expect(
      screen.getByText(/이미 존재하는 nickname 입니다/),
    ).toBeInTheDocument();
  });
});
