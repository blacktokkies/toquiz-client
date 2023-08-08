import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { useSearchParams, useNavigate, Link, redirect } from 'react-router-dom';

import Button from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useLoginMutation } from '@/hooks/queries/auth';
import { useUserStore } from '@/hooks/store/useUserStore';
import { useForm } from '@/hooks/useForm';
import { setAccessToken } from '@/lib/apiClient';
import { isUserLoggedIn } from '@/lib/routeGuard';
import { isEmail, isPassword } from '@/lib/validator';

export const LOGIN_ERROR_MESSAGE = {
  email: '이메일 형식의 아이디를 입력하세요',
  password: '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
} as const;

export const loginLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (isLoggedIn) return redirect('/home');
  return null;
};

function Login(): JSX.Element {
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') ?? '/home';

  const loginMutation = useLoginMutation();
  const { inputProps, errors, formProps, hasError } = useForm({
    inputConfigs: {
      email: {
        validate: (value) => isEmail(value),
        errorMessage: LOGIN_ERROR_MESSAGE.email,
      },
      password: {
        validate: (value) => isPassword(value),
        errorMessage: LOGIN_ERROR_MESSAGE.password,
      },
    },
    formConfig: {
      onSubmit: ({ email, password }) => {
        loginMutation.mutate(
          { email, password },
          {
            onSuccess: ({ accessToken, ...rest }) => {
              setAccessToken(accessToken);
              setUser(rest);
              navigate(`${next}`);
            },
            onError: (error, body) => {
              console.log(error);
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
            label="이메일"
            required
            placeholder="이메일을 입력하세요"
            errorMessage={errors.email}
            {...inputProps.email}
            aria-label="이메일 인풋"
          />
          <LabelInput
            label="비밀번호"
            type="password"
            required
            placeholder="비밀번호를 입력하세요"
            errorMessage={errors.password}
            {...inputProps.password}
            aria-label="비밀번호 인풋"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={hasError || loginMutation.isLoading}
        >
          로그인
        </Button>
      </form>
      <div className="mt-2">
        계정이 없나요?{' '}
        <Link className="font-bold underline" to="/signup">
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default Login;
