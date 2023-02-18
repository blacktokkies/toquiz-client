import type { UseMutationResult } from '@tanstack/react-query';
import type { LogInBody, LogInResult, SignUpBody, SignUpResult } from 'shared';

import { useMutation } from '@tanstack/react-query';

import { login, signUp } from '@/lib/api/auth';
import { queryKey } from '@/lib/constants';

// TODO: Error 타입은 Api Error랑 error instanceof SyntaxError
export const useSignUpMutation = (): UseMutationResult<
  SignUpResult,
  Error,
  SignUpBody,
  unknown
> => {
  const key = queryKey.auth.signup();
  const mutation = useMutation<SignUpResult, Error, SignUpBody, unknown>(
    key,
    signUp,
  );
  return mutation;
};

export const useLoginMutation = (): UseMutationResult<
  LogInResult,
  Error,
  LogInBody,
  unknown
> => {
  const key = queryKey.auth.login();
  const mutation = useMutation<LogInResult, Error, LogInBody, unknown>(
    key,
    login,
  );

  return mutation;
};
