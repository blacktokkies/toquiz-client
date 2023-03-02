import type { LoaderFunction } from 'react-router-dom';
import type { SignUpBody } from 'shared';

import React from 'react';

import { Link, useNavigate, redirect } from 'react-router-dom';

import SignUpForm from '@/components/auth/SignUpForm';
import { useSignUpMutation } from '@/hooks/mutations/auth';
import { isUserLoggedIn } from '@/lib/routeGuard';

export const signupLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (isLoggedIn) return redirect('/main');
  return null;
};

function Signup(): JSX.Element {
  const mutation = useSignUpMutation();

  const navigate = useNavigate();

  const handleSubmit = ({ username, password, nickname }: SignUpBody): void => {
    mutation.mutate(
      { username, password, nickname },
      {
        onSuccess: () => {
          navigate('/login');
        },
      },
    );
  };

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-9">
      <div className="mb-14 text-3xl font-bold">toquiz</div>
      <SignUpForm action={handleSubmit} />
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
