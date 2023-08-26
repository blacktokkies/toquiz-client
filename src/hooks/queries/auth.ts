import type {
  LogInBody,
  LogInResult,
  SignUpBody,
  SignUpError,
  LoginError,
  LogoutError,
  SignUpResponse,
  LogoutResponse,
} from '@/lib/api/auth';
import type { ApiError } from '@/lib/apiClient';
import type { UseMutationResult } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import { login, logout, signUp } from '@/lib/api/auth';
import { queryKey } from '@/lib/queryKey';

export const useSignUpMutation = (): UseMutationResult<
  SignUpResponse,
  ApiError<SignUpError | undefined> | SyntaxError,
  SignUpBody
> => {
  const key = queryKey.auth.signup();
  const mutation = useMutation<
    SignUpResponse,
    ApiError<SignUpError | undefined> | SyntaxError,
    SignUpBody
  >(key, signUp);
  return mutation;
};

export const useLoginMutation = (): UseMutationResult<
  LogInResult,
  ApiError<LoginError | undefined> | SyntaxError,
  LogInBody
> => {
  const key = queryKey.auth.login();
  const mutation = useMutation<LogInResult, ApiError | SyntaxError, LogInBody>(
    key,
    login,
  );

  return mutation;
};

export const useLogoutMutation = (): UseMutationResult<
  LogoutResponse,
  ApiError<LogoutError | undefined> | SyntaxError,
  void
> => {
  const key = queryKey.auth.logout();
  const mutation = useMutation<
    LogoutResponse,
    ApiError<LogoutError | undefined> | SyntaxError
  >(key, logout);

  return mutation;
};
