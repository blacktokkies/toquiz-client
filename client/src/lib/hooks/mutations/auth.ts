import type { UseMutationResult } from '@tanstack/react-query';
import type { SignUpBody, SignUpResult } from 'shared';

import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/lib/api/auth';
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
