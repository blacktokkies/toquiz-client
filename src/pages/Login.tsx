import type { LogInBody } from '@/lib/api/auth';
import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { useSearchParams, useNavigate, Link, redirect } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';
import { useLoginMutation } from '@/hooks/queries/auth';
import { useUserStore } from '@/hooks/store/useUserStore';
import { setAccessToken } from '@/lib/apiClient';
import { isUserLoggedIn } from '@/lib/routeGuard';

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
  const handleSubmit = ({ username, password }: LogInBody): void => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: ({ accessToken, user }) => {
          setAccessToken(accessToken);
          setUser(user);
          navigate(`${next}`);
        },
      },
    );
  };

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-9">
      <div className="mb-14 text-3xl font-bold">toquiz</div>
      <LoginForm action={handleSubmit} />
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
