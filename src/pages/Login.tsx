import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { useSearchParams, useNavigate, Link, redirect } from 'react-router-dom';

import { Button } from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useLoginMutation } from '@/hooks/queries/auth';
import { useUserStore } from '@/hooks/stores/useUserStore';
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

export function Login(): JSX.Element {
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') ?? '/home';

  const loginMutation = useLoginMutation();
  const { inputProps, errors, formProps, hasError, setError } = useForm({
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
            onSuccess: ({ accessToken, ...user }) => {
              setAccessToken(accessToken);
              setUser(user);
              navigate(`${next}`);
            },
            onError: (error, body) => {
              // TODO: SyntaxError 어떻게 핸들링할 지 생각해보기
              if (error instanceof SyntaxError) return;
              if (error.data === undefined) return;

              const { email } = body;
              const { code } = error.data;

              if (code === 'NOT_EXIST_MEMBER') {
                console.log('===============================');
                setError('email', `${email}은 존재하지 않는 계정입니다`);
              } else if (code === 'INVALID_PASSWORD') {
                setError('password', '이메일과 비밀번호가 일치하지 않습니다');
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
            id="email"
            label="이메일"
            required
            placeholder="이메일을 입력하세요"
            errorMessage={errors.email}
            {...inputProps.email}
            aria-label="이메일 인풋"
          />
          <LabelInput
            id="password"
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
          className="w-full py-3 font-semibold"
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
