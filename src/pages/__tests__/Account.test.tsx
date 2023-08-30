import type * as Vi from 'vitest';

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { isNickname, isPassword } from '@/lib/validator';
import { Account } from '@/pages/Account';

vi.mock('@/lib/validator', () => ({
  isNickname: vi.fn(() => true),
  isPassword: vi.fn(() => true),
}));
describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    render(<Account />);

    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('내 계정 관리');
  });

  describe('프로필 수정', () => {
    it('프로필 수정 헤딩을 보여준다', () => {
      render(<Account />);

      expect(
        screen.getByRole<HTMLHeadingElement>('heading', {
          level: 2,
        }),
      ).toHaveTextContent('프로필 수정');
    });

    it('프로필 수정 폼을 보여준다', () => {
      render(<Account />);

      const form = screen.getByRole('form', {
        name: /프로필 수정 폼/,
      });

      expect(form).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 닉네임을 입력하면 에러 메시지를 보여준다', () => {
      (isNickname as Vi.Mock).mockImplementation(() => false);
      render(<Account />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      fireEvent.change(nicknameInput, {
        target: { value: '유효하지 않은 닉네임' },
      });

      expect(
        screen.getByText('2~20자 이하의 문자를 입력하세요'),
      ).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', () => {
      (isPassword as Vi.Mock).mockImplementation(() => false);
      render(<Account />);

      const passwordInput = screen.getByLabelText('비밀번호');
      fireEvent.change(passwordInput, {
        target: { value: '유효하지 않은 비밀번호' },
      });

      expect(
        screen.getByText(
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
        ),
      ).toBeInTheDocument();
    });

    it('사용자가 비밀번호 확인 인풋에 비밀번호 인풋과 동일하지 않은 값 입력하면 에러 메시지를 보여준다', () => {
      render(<Account />);

      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      fireEvent.change(passwordInput, {
        target: { value: '비밀번호' },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: '동일하지 않은 비밀번호' },
      });

      expect(
        screen.getByText('동일한 비밀번호를 입력하세요'),
      ).toBeInTheDocument();
    });
  });
});
