import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { Link, useNavigate, redirect } from 'react-router-dom';

import Button from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useSignUpMutation } from '@/hooks/queries/auth';
import { useForm } from '@/hooks/useForm';
import { isUserLoggedIn } from '@/lib/routeGuard';
import { isEmail, isNickname, isPassword } from '@/lib/validator';

export const signupLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (isLoggedIn) return redirect('/home');
  return null;
};

function Signup(): JSX.Element {
  const signUpMutation = useSignUpMutation();
  const navigate = useNavigate();
  const { inputProps, errors, formProps, hasError, setError } = useForm({
    inputConfigs: {
      email: {
        validate: (value) => isEmail(value),
        errorMessage: '이메일 형식의 아이디를 입력하세요',
      },
      password: {
        validate: (value) => isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
      'confirm-password': {
        validate: (value, refs) => value === refs.password?.value,
        errorMessage: '동일한 비밀번호를 입력하세요',
      },
      nickname: {
        validate: (value) => isNickname(value),
        errorMessage: '2~20자 이하의 문자를 입력하세요',
      },
    },
    formConfig: {
      onSubmit: (data) => {
        const { email, password, nickname } = data;
        signUpMutation.mutate(
          { email, password, nickname },
          {
            onSuccess: () => {
              navigate('/login');
            },
            onError: (error, body, ctx) => {
              // TODO: SyntaxError 어떻게 핸들링할 지 생각해보기
              if (error instanceof SyntaxError) return;
              // TODO: ApiError에서 응답이 확실하지 않을 때 어떻게 핸들링할 지 생각해보기
              if (!error.data) return;

              const { email } = body;

              if (error.data.code === 'DUPLICATE_EMAIL') {
                setError('email', `${email}은 이미 존재하는 계정입니다.`);
              }
            },
          },
        );
      },
    },
  });

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-9">
      <div className="mb-14 text-3xl font-bold">toquiz</div>
      <form className="flex w-full flex-col gap-8" {...formProps}>
        <div className="flex flex-col gap-5">
          <LabelInput
            label="아이디"
            name="email"
            required
            placeholder="아이디를 입력하세요"
            errorMessage={errors.email}
            {...inputProps.email}
          />
          <LabelInput
            label="비밀번호"
            name="password"
            type="password"
            required
            placeholder="비밀번호를 입력하세요"
            errorMessage={errors.password}
            {...inputProps.password}
          />
          <LabelInput
            label="비밀번호 확인"
            name="confirm-password"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
            errorMessage={errors['confirm-password']}
            {...inputProps['confirm-password']}
          />
          <LabelInput
            label="닉네임"
            name="nickname"
            required
            placeholder="닉네임을 입력하세요"
            errorMessage={errors.nickname}
            {...inputProps.nickname}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={hasError || signUpMutation.isLoading}
        >
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
