const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
} as const;

export const queryKey = {
  auth: authQueryKey,
};
