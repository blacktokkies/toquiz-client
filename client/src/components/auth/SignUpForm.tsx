import type { FormEvent } from 'react';
import type { SignUpBody } from 'shared';

import React, { useRef } from 'react';

import Button from '@/components/Button';
import LabelInput from '@/components/LabelInput';
import { useFormError } from '@/hooks/useFormError';
import { isEmail, isNickname } from '@/lib/validator';

interface Props {
  action: (props: SignUpBody) => void;
}
const SignUpForm = ({ action }: Props): JSX.Element => {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { onChange, errors } = useFormError({
    form: {
      username: {
        validate: (value) => isEmail(value),
        errorMessage: '이메일 형식의 아이디를 입력하세요',
      },
      password: {
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
      confirm_password: {
        validate: (value) => value === passwordRef.current?.value,
        errorMessage: '동일한 비밀번호를 입력하세요',
      },
      nickname: {
        validate: (value) => isNickname(value),
        errorMessage: '1자 이상의 문자를 입력하세요',
      },
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataRecord = Object.fromEntries(formData) as Record<
      string,
      string
    >;
    const { username, password, nickname } = formDataRecord;
    action({ username, password, nickname: nickname.trim() });
  };

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5">
        <LabelInput
          label="아이디"
          name="username"
          required
          placeholder="아이디를 입력하세요"
          errorMessage={errors.username}
          onChange={onChange.username}
        />
        <LabelInput
          ref={passwordRef}
          label="비밀번호"
          name="password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요"
          errorMessage={errors.password}
          onChange={onChange.password}
        />
        <LabelInput
          label="비밀번호 확인"
          name="confirm-password"
          type="password"
          required
          placeholder="비밀번호를 다시 입력하세요"
          errorMessage={errors.confirm_password}
          onChange={onChange.confirm_password}
        />
        <LabelInput
          label="닉네임"
          name="nickname"
          required
          placeholder="닉네임을 입력하세요"
          errorMessage={errors.nickname}
          onChange={onChange.nickname}
        />
      </div>
      <Button type="submit" className="w-full">
        회원가입
      </Button>
    </form>
  );
};

export default SignUpForm;
