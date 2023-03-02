const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
} as const;

export const queryKey = {
  auth: authQueryKey,
};

const AUTH_API_BASE_URL = `/api/users/auth`;
const authApiUrl = {
  signup: () => `${AUTH_API_BASE_URL}/signup` as const,
  login: () => `${AUTH_API_BASE_URL}/login` as const,
  me: () => `/api/user` as const,
  refresh: () => `${AUTH_API_BASE_URL}/refresh` as const,
};

export const apiUrl = {
  auth: authApiUrl,
};
