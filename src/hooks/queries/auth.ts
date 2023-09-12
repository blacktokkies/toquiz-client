import type {
  LogInBody,
  LogInResult,
  SignUpBody,
  SignUpError,
  LoginError,
  LogoutError,
  SignUpResponse,
  LogoutResponse,
  ResignResponse,
  ResignBody,
  ResignError,
  UpdateMyInfoResult,
  UpdateMyInfoBody,
} from '@/lib/api/auth';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import { login, logout, resign, signUp, updateMyInfo } from '@/lib/api/auth';
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

/* ================================ [ 회원 정보 수정 뮤테이션 ] ====================================== */
export type UpdateMyInfoMutation = NonNullableKeys<
  Pick<
    UseMutationOptions<
      UpdateMyInfoResult,
      ApiError | SyntaxError,
      UpdateMyInfoBody
    >,
    'mutationKey' | 'mutationFn'
  >
>;

export const updateMyInfoMutation = (): UpdateMyInfoMutation => ({
  mutationKey: queryKey.auth.update(),
  mutationFn: async (body) => (await updateMyInfo(body)).result,
});
export const useUpdateMyInfoMutation = (
  options: UseMutationOptions<
    UpdateMyInfoResult,
    ApiError | SyntaxError,
    UpdateMyInfoBody
  > = {},
): UseMutationResult<
  UpdateMyInfoResult,
  ApiError | SyntaxError,
  UpdateMyInfoBody
> => useMutation({ ...updateMyInfoMutation(), ...options });

export const useResignMutation = (): UseMutationResult<
  ResignResponse,
  ApiError<ResignError> | SyntaxError,
  ResignBody
> => {
  const key = queryKey.auth.resign();
  const mutation = useMutation<
    ResignResponse,
    ApiError<ResignError> | SyntaxError,
    ResignBody
  >(key, resign);
  return mutation;
};
