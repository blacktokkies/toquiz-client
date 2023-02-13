const authQueryKey = {
  signup: () => ['signup'] as const,
};

export const queryKey = {
  auth: authQueryKey,
};

const authApiUrl = {
  signup: () => `/api/users/auth/signup`,
};

export const apiUrl = {
  auth: authApiUrl,
};
