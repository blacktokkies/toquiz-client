import type { Panel } from './api/panel';

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

const questionQuerykey = {
  all: ['questions'] as const,
  lists: () => [...questionQuerykey.all, 'list'] as const,
  list: (panelId: Panel['id']) =>
    [...questionQuerykey.lists(), panelId] as const,
};

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
  question: questionQuerykey,
};
