const authQueryKey = {
  signup: () => ['signup'] as const,
  login: () => ['login'] as const,
  logout: () => ['logout'] as const,
} as const;

const panelQueryKey = {
  all: ['panels'] as const,
  lists: () => [...panelQueryKey.all, 'list'] as const,
  create: () => ['createPanel'] as const,
  update: () => ['updatePanel'] as const,
  delete: () => ['deletePanel'] as const,
} as const;

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
};
