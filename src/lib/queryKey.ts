import type { Panel } from './api/panel';
import type { GetQuestionsParams } from './api/question';

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

const activeInfoQueryKeys = {
  all: ['activeInfos'] as const,
  details: () => [...activeInfoQueryKeys.all, 'details'],
  detail: (panelId: Panel['id']) => [...activeInfoQueryKeys.details(), panelId],
};

const questionQuerykey = {
  all: ['questions'] as const,
  lists: () => [...questionQuerykey.all, 'list'] as const,
  list: (panelId: Panel['id'], sort: GetQuestionsParams['sort'] = undefined) =>
    [...questionQuerykey.lists(), panelId, { sort }] as const,
  create: () => ['createQuestion'] as const,
  like: () => ['likeQuestion'] as const,
};

export const queryKey = {
  auth: authQueryKey,
  panel: panelQueryKey,
  question: questionQuerykey,
  activeInfo: activeInfoQueryKeys,
};
