const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
} as const;

const panelQueryKey = {
  all: ['panels'] as const,
  lists: () => [...panelQueryKey.all, 'list'] as const,
  create: () => ['createPanel'] as const,
} as const;

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
};
