const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
} as const;

const panelQueryKey = {
  all: ['panels'] as const,
  list: () => [...panelQueryKey.all, 'list'] as const,
};

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
};
