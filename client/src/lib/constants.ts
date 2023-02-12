const authQueryKey = {
  signup: () => ['signup'] as const,
};

export const queryKey = {
  auth: authQueryKey,
};

const authApiUrl = {
  signup: () => `/api/user/auth/signup`,
};

export const apiUrl = {
  auth: authApiUrl,
};
