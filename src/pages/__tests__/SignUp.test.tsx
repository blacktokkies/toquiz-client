import type { ErrorResponse } from '@/lib/api/response';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';

import { apiUrl } from '@/lib/apiUrl';
import { renderWithQueryClient } from '@/lib/test-utils';
import { server } from '@/mocks/server';
import Signup from '@/pages/SignUp';

function overrideSignUpResultWithError(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.auth.signup(), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

describe('회원가입 페이지', () => {
  vi.mock('@/lib/validator', () => ({
    isEmail: vi.fn().mockImplementation(() => true),
    isNickname: vi.fn().mockImplementation(() => true),
    isPassword: vi.fn().mockImplementation(() => true),
  }));

  it('중복된 이메일을 제출하면 에러 메시지를 보여준다', async () => {
    overrideSignUpResultWithError({
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

    await waitFor(() => {
      expect(
        screen.getByText(/이미 존재하는 이메일입니다/),
      ).toBeInTheDocument();
    });
  });
  it('중복된 닉네임을 제출하면 에러 메시지를 보여준다', async () => {
    overrideSignUpResultWithError({
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

    await waitFor(() => {
      expect(
        screen.getByText(/이미 존재하는 닉네임입니다/),
      ).toBeInTheDocument();
    });
  });

  it('유효하지 않은 이메일, 닉네임, 비밀번호를 제출하면 에러 메시지를 보여준다.', async () => {
    overrideSignUpResultWithError({
      code: 'INVALID_PARAMETER',
      statusCode: 400,
      message: 'Invalid parameter included',
      errors: [
        {
          field: 'nickname',
          message: '닉네임은 8 ~ 20자 이어야 합니다.',
        },
        {
          field: 'password',
          message:
            '비밀번호는 영문자, 숫자, 특수기호를 반드시 포함해야 합니다.',
        },
        {
          field: 'email',
          message: '아이디는 이메일 형식으로 입력해주세요.',
        },
      ],
    });

    renderWithQueryClient(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: '회원가입' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/이메일 형식의 아이디를 입력하세요/),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요/,
        ),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/2~20자 이하의 문자를 입력하세요/),
      ).toBeInTheDocument();
    });
  });
});
