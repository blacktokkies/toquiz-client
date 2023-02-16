const authQueryKey = {
  signup: () => ['signup'] as const,
};

export const queryKey = {
  auth: authQueryKey,
};

const AUTH_API_BASE_URL = `/api/users/auth`;
const authApiUrl = {
  signup: () => `${AUTH_API_BASE_URL}/signup`,
  login: () => `${AUTH_API_BASE_URL}/login`,
};

export const apiUrl = {
  auth: authApiUrl,
};
