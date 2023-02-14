import type { FormEvent } from 'react';

import React, { useRef } from 'react';

import { Link } from 'react-router-dom';

import Button from '@/components/Button';
import LabelInput from '@/components/LabelInput';
import { useSignUpMutation } from '@/hooks/mutations/auth';
import { useFormError } from '@/hooks/useFormError';

function Signup(): JSX.Element {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { handleChangeWithValidation, errors } = useFormError({
    form: {
      username: {
        errorMessage: '5~16자 이하의 영문 대소문자, 숫자, @를 입력하세요',
      },
      password: {
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
      confirm_password: {
        validate: (value) => value === passwordRef.current?.value,
        errorMessage: '동일한 비밀번호를 입력하세요',
      },
    },
  });
  const mutation = useSignUpMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataRecord = Object.fromEntries(formData) as Record<
      string,
      string
    >;
    const { username, password, nickname } = formDataRecord;
    mutation.mutate({ username, password, nickname });
  };

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-9">
      <div className="mb-14 text-3xl font-bold">toquiz</div>
      <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <LabelInput
            label="아이디"
            required
            placeholder="아이디를 입력하세요"
            errorMessage={errors.username}
            onChange={handleChangeWithValidation.username}
          />
          <LabelInput
            ref={passwordRef}
            label="비밀번호"
            name="password"
            type="password"
            required
            placeholder="비밀번호를 입력하세요"
          />
          <LabelInput
            label="비밀번호 확인"
            name="confirm-password"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
            errorMessage={errors.confirm_password}
            onChange={handleChangeWithValidation.confirm_password}
          />
          <LabelInput
            label="닉네임"
            name="nickname"
            required
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <Button type="submit" className="w-full">
          회원가입
        </Button>
      </form>
      <div className="mt-2">
        계정이 있나요?{' '}
        <Link className="font-bold underline" to="/login">
          로그인
        </Link>
      </div>
    </div>
  );
}

export default Signup;
