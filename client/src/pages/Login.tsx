import type { LoaderFunction } from 'react-router-dom';
import type { LogInBody } from 'shared';

import React from 'react';

import { useSearchParams, useNavigate, Link, redirect } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';
import { useLoginMutation } from '@/hooks/mutations/auth';
import { useUserStore } from '@/hooks/store/useUserStore';
import { getUser } from '@/store/userStore';

export const loginLoader: LoaderFunction = () => {
  const user = getUser();

  if (user) return redirect('/main');
  return null;
};

function Login(): JSX.Element {
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('from') ?? '/main';

  const loginMutation = useLoginMutation();
  const handleSubmit = ({ username, password }: LogInBody): void => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          setUser(data.user);
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
