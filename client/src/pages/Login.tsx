import type { LoginBody } from '@/lib/api/auth';

import React from 'react';

import { Link } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';
import { useLoginMutation } from '@/hooks/mutations/auth';

function Login(): JSX.Element {
  const loginMutation = useLoginMutation();
  const handleSubmit = ({ username, password }: LoginBody): void => {
    loginMutation.mutate({ username, password });
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
